<?php

namespace App\Application\Orders\Queries;

class GetOrderDetailQuery
{
    public string $storeOwner;
    public string $id;

    public function __construct(string $storeOwner, string $id)
    {
        $this->storeOwner = $storeOwner;
        $this->id = $id;
    }
}
