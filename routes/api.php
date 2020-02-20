<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('pending', 'TaskController@pending');
Route::get('current', 'TaskController@current');
Route::get('finished', 'TaskController@finished');
Route::post('changestatus/{id}/{status}', 'TaskController@change');
Route::post('addtask', 'TaskController@store');
Route::post('removetask/{id}', 'TaskController@destroy');