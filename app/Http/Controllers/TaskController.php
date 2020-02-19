<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Tasks;

class TaskController extends Controller
{
    public function index()
    {
        return Tasks::orderBy('status', 'asc')->orderBy('id', 'asc')->get();
    }

    public function pending()
    {
        return Tasks::where('status', 0)->orderBy('status', 'asc')->orderBy('id', 'asc')->get();
    }

    public function current()
    {
        return Tasks::where('status', 1)->orderBy('status', 'asc')->orderBy('id', 'asc')->get();
    }

    public function finished()
    {
        return Tasks::where('status', 2)->orderBy('status', 'asc')->orderBy('id', 'asc')->get();
    }

    public function store(Request $request)
    {
        return Tasks::create($request->all());
    }
    
    public function change(Tasks $id, $status)
    {
        $id->status = $status;
        $id->save();
        return $id;
    }

    public function destroy(todo $id)
    {
    }
}
