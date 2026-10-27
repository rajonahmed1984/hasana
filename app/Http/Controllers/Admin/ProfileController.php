<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = Auth::user();
        if ($request->expectsJson()) {
            return response()->json(['user' => $user]);
        }
        return view('admin.spa');
    }

    public function edit(Request $request)
    {
        $user = Auth::user();
        if ($request->expectsJson()) {
            return response()->json(['user' => $user]);
        }
        return view('admin.spa');
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Profile updated successfully!',
                'user' => $user->refresh(),
            ]);
        }

        return redirect()->route('admin.profile.show')
            ->with('success', 'Profile updated successfully!');
    }

    public function editPassword(Request $request)
    {
        return view('admin.spa');
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        Auth::user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Password changed successfully!',
            ]);
        }

        return redirect()->route('admin.profile.show')
            ->with('success', 'Password changed successfully!');
    }
}
