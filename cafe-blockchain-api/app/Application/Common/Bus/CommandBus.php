<?php

namespace App\Application\Common\Bus;

use Illuminate\Support\Str;

class CommandBus
{
    /**
     * Dispatch command tới Handler tương ứng
     */
    public function dispatch($command)
    {
        $commandClass = get_class($command);
        
        // Quy tắc chuyển đổi tên: App\Application\Orders\Commands\CreateOrderCommand
        // thành: App\Application\Orders\Handlers\CreateOrderCommandHandler
        // Hoặc nếu đặt chung thư mục Commands thì Handler tương ứng có thể ở cùng namespace
        $handlerClass = $this->resolveHandlerClass($commandClass);

        if (!class_exists($handlerClass)) {
            // Thử tìm trong cùng namespace với hậu tố Handler
            $handlerClass = $commandClass . 'Handler';
        }

        if (!class_exists($handlerClass)) {
            throw new \RuntimeException("No handler found for command: {$commandClass}");
        }

        // Tự động phân giải Handler thông qua Service Container
        $handler = app($handlerClass);

        return $handler->handle($command);
    }

    /**
     * Phân giải tên lớp Handler từ tên lớp Command
     */
    protected function resolveHandlerClass(string $commandClass): string
    {
        // Thay thế 'Commands' hoặc 'Queries' thành 'Handlers'
        // Thêm hậu tố 'Handler'
        $handlerClass = str_replace(['\\Commands\\', '\\Queries\\'], '\\Handlers\\', $commandClass);
        
        if (!Str::endsWith($handlerClass, 'Handler')) {
            $handlerClass .= 'Handler';
        }

        return $handlerClass;
    }
}
