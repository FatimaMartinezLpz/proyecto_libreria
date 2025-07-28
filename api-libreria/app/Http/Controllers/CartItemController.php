<?php


namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;


class CartItemController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        return CartItem::with('book')
            ->where('user_id', $user->id)
            ->get();
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $bookId = $request->input('book_id');
        $book = Book::findOrFail($bookId);

        $cartItem = CartItem::where('user_id', $user->id)
            ->where('book_id', $bookId)
            ->first();

        if ($cartItem) {
            $cartItem->quantity += 1;
            $cartItem->total_price = $cartItem->quantity * $cartItem->unit_price;
            $cartItem->save();
        } else {
            $cartItem = CartItem::create([
                'user_id' => $user->id,
                'book_id' => $book->id,
                'quantity' => 1,
                'unit_price' => $book->price,
                'total_price' => $book->price,
            ]);
        }

        return response()->json($cartItem->load('book'), 201);
    }

    public function update($id)
    {
        $user = Auth::user();
        $cartItem = CartItem::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $cartItem->quantity += 1;
        $cartItem->total_price = $cartItem->quantity * $cartItem->unit_price;
        $cartItem->save();

        return response()->json($cartItem->load('book'));
    }

    public function decrease($id)
    {
        $user = Auth::user();
        $cartItem = CartItem::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        if ($cartItem->quantity > 1) {
            $cartItem->quantity -= 1;
            $cartItem->total_price = $cartItem->quantity * $cartItem->unit_price;
            $cartItem->save();
        } else {
            $cartItem->delete();
        }

        return response()->json(['message' => 'Cantidad actualizada o ítem eliminado']);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $cartItem = CartItem::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $cartItem->delete();

        return response()->json(['message' => 'Ítem eliminado del carrito']);
    }
    public function decreaseQuantity($id)
    {
        $item = CartItem::find($id);
        if (!$item) {
            return response()->json(['error' => 'Item no encontrado'], 404);
        }

        if ($item->quantity > 1) {
            $item->quantity--;
            $item->total_price = $item->quantity * $item->unit_price;
            $item->save();
        } else {
            $item->delete(); // o manejarlo según tu lógica
        }

        return response()->json($item);
    }
}
