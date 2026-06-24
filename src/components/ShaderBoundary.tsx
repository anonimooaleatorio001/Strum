import { Component, type ReactNode } from "react";

/**
 * Keeps the page alive if the WebGL shader stack fails to initialise
 * (e.g. no GPU / WebGL disabled) — we just fall back to the Sand backdrop.
 */
export default class ShaderBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}
