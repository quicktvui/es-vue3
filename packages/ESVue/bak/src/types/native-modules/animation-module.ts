import { NeedToTyped } from "../index";

export interface AnimationModule {
  createAnimation: (animationId: number, mode: string, params: NeedToTyped) => void;

  updateAnimation: (animationId: number, params: NeedToTyped) => void;

  createAnimationSet: (animationId: number, params: NeedToTyped) => void;

  startAnimation: (animationId: number) => void;

  stopAnimation: (animationId: number) => void;

  pauseAnimation: (animationId: number) => void;

  resumeAnimation: (animationId: number) => void;

  destroyAnimation: (animationId: number) => void;
}
