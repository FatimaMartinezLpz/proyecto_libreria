<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Book;

class BookController extends Controller
{
    public function index()
    {
        return Book::all();
    }

    public function show($id)
    {
        return Book::findOrFail($id);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'author' => 'required|string|max:255',
                'description' => 'nullable|string',
                'category' => 'required|string|max:100',
                'price' => 'required|numeric',
                'stock' => 'required|integer',
                'cover_url' => 'nullable|url',
            ]);

            $book = Book::create($validated);

            return response()->json([
                'message' => 'Libro creado exitosamente',
                'book' => $book
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Error al crear el libro',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    public function update(Request $request, $id)
    {
        $book = Book::findOrFail($id);
        $book->update($request->all());
        return $book;
    }

    public function destroy($id)
    {
        $book = Book::findOrFail($id);
        $book->delete();
        return response()->json(['message' => 'Libro eliminado']);
    }
    public function verifyStock(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:books,id',
            'items.*.quantity' => 'required|integer|min:1'
        ]);

        $items = $request->input('items');

        foreach ($items as $item) {
            $book = Book::find($item['id']);

            if (!$book || $book->stock < $item['quantity']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Stock insuficiente',
                    'book_id' => $item['id'],
                    'available_stock' => $book ? $book->stock : 0,
                    'requested_quantity' => $item['quantity']
                ], 400);
            }
        }

        return response()->json(['success' => true]);
    }
    public function search(Request $request)
    {
        $query = $request->input('q');

        $books = Book::where('title', 'like', "%$query%")
            ->orWhere('author', 'like', "%$query%")
            ->get();

        return response()->json($books);
    }
}
