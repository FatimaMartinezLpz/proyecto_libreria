<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Book;
use App\Models\CartItem;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Validar los datos del formulario de checkout
        $validated = $request->validate([
            'shipping_address' => 'required|string|max:255',
            'payment_method' => 'required|string|in:tarjeta,paypal,transferencia',
        ]);

        // Obtener los items del carrito con eager loading
        $cartItems = CartItem::where('user_id', $user->id)
            ->with('book')
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'El carrito está vacío'], 400);
        }

        // Verificar stock antes de crear la orden
        foreach ($cartItems as $item) {
            if ($item->book->stock < $item->quantity) {
                return response()->json([
                    'message' => 'No hay suficiente stock para el libro: ' . $item->book->title,
                    'book_id' => $item->book->id
                ], 400);
            }
        }

        // Calcular el total
        $total = $cartItems->sum(function ($item) {
            return $item->book->price * $item->quantity;
        });

        // Crear la orden
        $order = Order::create([
            'user_id' => $user->id,
            'total' => $total,
            'status' => 'pendiente',
            'shipping_address' => $validated['shipping_address'],
            'payment_method' => $validated['payment_method'],
        ]);

        // Crear los order items y actualizar el stock
        foreach ($cartItems as $cartItem) {
            OrderItem::create([
                'order_id' => $order->id,
                'book_id' => $cartItem->book_id,
                'quantity' => $cartItem->quantity,
                'unit_price' => $cartItem->book->price,
                'total_price' => $cartItem->book->price * $cartItem->quantity,
            ]);

            // Actualizar el stock
            $book = Book::find($cartItem->book_id);
            $book->stock -= $cartItem->quantity;
            $book->save();
        }

        // Vaciar el carrito
        CartItem::where('user_id', $user->id)->delete();

        return response()->json([
            'message' => 'Orden creada exitosamente',
            'order_id' => $order->id,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $order = Order::with(['items.book'])
            ->where('id', $id)
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Orden no encontrada'], 404);
        }

        return response()->json([
            'id' => $order->id,
            'total' => $order->total,
            'status' => $order->status,
            'payment_method' => $order->payment_method,
            'shipping_address' => $order->shipping_address,
            'created_at' => $order->created_at,
            'items' => $order->items->map(function ($item) {
                return [
                    'quantity' => $item->quantity,
                    'total_price' => $item->total_price,
                    'book' => [
                        'title' => $item->book->title,
                        'cover_url' => $item->book->cover_url,
                        'price' => $item->book->price
                    ]
                ];
            })
        ]);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
