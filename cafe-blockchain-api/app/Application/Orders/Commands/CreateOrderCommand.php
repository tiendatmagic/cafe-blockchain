<?php

namespace App\Application\Orders\Commands;

class CreateOrderCommand
{
    public string $storeOwner;
    public array $data;

    public function __construct(string $storeOwner, array $data)
    {
        $this->storeOwner = $storeOwner;
        $this->data = $data;
    }
}
