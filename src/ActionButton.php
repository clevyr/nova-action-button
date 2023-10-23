<?php

namespace Clevyr\NovaFields;

use Laravel\Nova\Actions\Action;
use Laravel\Nova\Fields\Field;

class ActionButton extends Field
{
    /**
     * The field's component.
     *
     * @var string
     */
    public $component = 'nova-action-button';

    /**
     * @param Action|string|null $action
     * @param $resourceId
     * @return ActionButton
     */
    public function action($action, $resourceId): ActionButton
    {
        $actionInst = \is_string($action) ? new $action() : $action;

        if ($actionInst) {
            $actionInst->withMeta([
                'resourceId' => $resourceId
            ]);
        }

        return $this->withMeta([
            'action' => $actionInst,
            'resourceId' => $resourceId,
        ]);
    }

    /**
     * The text to be displayed inside the button.
     *
     * @param string $text
     * @return ActionButton
     */
    public function text(string $text): ActionButton
    {
        return $this->withMeta(compact('text'));
    }

    /**
     * Enable loading animation.
     *
     * @param bool $callback
     * @return ActionButton
     */
    public function showLoadingAnimation(bool $callback = true): ActionButton
    {
        return $this->withMeta(
            [
                'showLoadingAnimation' => is_callable($callback) ? $callback() : $callback
            ]
        );
    }

    /**
     * Change loading animation color
     *
     * @param string $loadingColor
     * @return ActionButton
     */
    public function loadingColor(string $loadingColor): ActionButton
    {
        return $this->withMeta(compact('loadingColor'));
    }

    /**
     * Pass a vue component containing a svg
     *
     * @param string $svg
     * @return ActionButton
     */
    public function svg(string $svg): ActionButton
    {
        return $this->withMeta(['svg' => $svg]);
    }

    /**
     * Change button color.
     */
    public function buttonColor(string $buttonColor): ActionButton
    {
        return $this->withMeta(compact('buttonColor'));
    }
}
