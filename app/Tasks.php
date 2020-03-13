<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Tasks extends Model
{
    use Searchable;
    
    // public $timestamps = false;
    protected $fillable = ['tasks', 'status', 'description'];
}
