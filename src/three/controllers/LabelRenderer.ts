import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';

export class LabelRendererController {
  renderer: CSS2DRenderer;
  
  constructor(canvas : HTMLCanvasElement) {
    this.renderer = new CSS2DRenderer();
    const vpW: number = canvas.clientWidth
    const vpH: number = canvas.clientHeight
    this.renderer.setSize(vpW, vpH);
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = '0px';
    this.renderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild(this.renderer.domElement);
  }
}
