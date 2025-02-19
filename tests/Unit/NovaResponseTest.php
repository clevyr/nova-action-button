<?php

namespace Tests\Unit;

use Laravel\Nova\Actions\ActionResponse;
use PHPUnit\Framework\TestCase;

class NovaResponseTest extends TestCase
{
    // Our library depends on Laravel Nova's serialized responses, so we confirm
    // our expected output with these tests. If changes happen here, we need to
    // update the `handleActionResponse` methods in the IndexField.vue and
    // DetailField.vue components accordingly.

    public function test_redirect(): void
    {
        $res = ActionResponse::redirect('/test');
        $jsonContent = json_decode(json_encode($res), true);
        $this->assertEquals([
            'redirect' => [
                'url' => '/test',
                'openInNewTab' => false,
            ],
        ], $jsonContent);
    }

    public function test_visit(): void
    {
        $res = ActionResponse::visit('/test', ['replace' => true]);
        $jsonContent = json_decode(json_encode($res), true);
        $this->assertEquals([
            'visit' => [
                'path' => '/test',
                'options' => ['replace' => true],
            ],
        ], $jsonContent);
    }

    public function test_danger(): void
    {
        $res = ActionResponse::danger('danger message');
        $jsonContent = json_decode(json_encode($res), true);
        $this->assertEquals([
            'danger' => 'danger message',
        ], $jsonContent);
    }

    public function test_message(): void
    {
        $res = ActionResponse::message('message message');
        $jsonContent = json_decode(json_encode($res), true);
        $this->assertEquals([
            'message' => 'message message',
        ], $jsonContent);
    }

    public function test_download(): void
    {
        $res = ActionResponse::download('filename.txt', 'https://example.com/dl');
        $jsonContent = json_decode(json_encode($res), true);
        $this->assertEquals([
            'download' => [
                'name' => 'filename.txt',
                'url' => 'https://example.com/dl',
            ],
        ], $jsonContent);
    }

    public function test_modal(): void
    {
        $res = ActionResponse::modal('some-component', ['key' => 'value']);
        $jsonContent = json_decode(json_encode($res), true);
        $this->assertEquals([
            'modal' => [
                'component' => 'some-component',
                'payload' => ['key' => 'value'],
            ],
        ], $jsonContent);
    }

    public function test_deleted(): void
    {
        $res = ActionResponse::deleted();
        $jsonContent = json_decode(json_encode($res), true);
        $this->assertEquals([
            'deleted' => true,
        ], $jsonContent);
    }
}
