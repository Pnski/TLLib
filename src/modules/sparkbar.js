// from https://observablehq.observablehq.cloud/framework/inputs/table
import {html} from "htl";

export function sparkbar(max) {
  return (x) => html`<div style="
    background: color-mix(in srgb, var(--syntax-constant) 20%, var(--theme-foreground-fainter));
    width: ${100 * x / max}%;
    float: right;
    padding-right: 3px;
    box-sizing: border-box;
    overflow: visible;
    display: flex;
    justify-content: end;">${x.toLocaleString()}`
}