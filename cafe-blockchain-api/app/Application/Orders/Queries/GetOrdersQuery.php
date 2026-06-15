<?php

namespace App\Application\Orders\Queries;

class GetOrdersQuery
{
    public string $storeOwner;
    public array $filters;

    public function __construct(string $storeOwner, array $filters = [])
    {
        $this->storeOwner = $storeOwner;
        $this->filters = $filters;
    }
}
