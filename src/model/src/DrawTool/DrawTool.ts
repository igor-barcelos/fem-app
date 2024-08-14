import * as THREE from 'three';
import * as OBC from '@thatopen/components'

import { effect } from '@preact/signals-react';
import { drawTypeSignal } from '../Signals/Modelling';
import { Model } from '../Model';
export class DrawTool extends Model{
  enabled = true;
  constructor() { 
    super()
    this.setupEvents(true)
    effect(() => {
      if(drawTypeSignal.value === 'Line'){
        console.log('logging effect 10')
      }
    })
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && drawTypeSignal.value != 'None'){
      console.log('turnning off draw tool')
      drawTypeSignal.value = 'None';
    }
  };

  private setupEvents(active: boolean) {
		if(active) {
			window.addEventListener("keydown", this.onKeyDown);
		} else {
			window.removeEventListener("keydown", this.onKeyDown);
		}
	}
}
