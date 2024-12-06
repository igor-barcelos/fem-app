import { Model } from '../Model';
import * as THREE from 'three';
import { ToolsId, styles } from './types/types';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
export class Line  {
  lineMode: number;
  lineSegments: number;
  currentTempLine : THREE.Line;
  model : Model 
  currentPointerCoord : THREE.Vector3;
  onOrthoMode : boolean;
  type : ToolsId;
  constructor(model : Model, ) 
  {
    this.model = model
    this.lineMode = 0; //0: 2-pt line, 1: polyline
    this.lineSegments = 1;
    this.currentTempLine = new THREE.Line()
    this.currentPointerCoord = new THREE.Vector3();
    this.onOrthoMode = true;
    this.type = ToolsId.AXES;
  }


  start = () => {
    // super.start(camera, plane);
    this.model.canvas.addEventListener('mousemove', this._onMouseMove);
    this.model.canvas.addEventListener('click', this._onDrawClick);
    window.addEventListener('keydown', this._onKey);
  };

  private _onMouseMove = (e: MouseEvent) => {
    const mouseLoc = this.getMouseLocation(e,this.model.canvas, this.model.worldPlane, this.model.camera);
    this.currentPointerCoord = mouseLoc;
    if (this.model.drawTool.toolState === 1) {
      this.currentPointerCoord = mouseLoc;
    }

    if (this.model.drawTool.toolState === 2 ||  this.model.drawTool.toolState === 3) {
      this.updTempLine(this.currentPointerCoord)

    }
  }

  private _onDrawClick = () => {
    //ON FIRST CLICK
    if (this.model.drawTool.toolState === 1) {
    const tempLinePoints =  Array(2).fill(this.currentPointerCoord); 
    this.initTempLine(tempLinePoints)
    this.model.drawTool.toolState = 2;
    }
    else if (this.model.drawTool.toolState === 2) {
      this.createLine(this.model.drawTool.toolState)
      this.model.drawTool.toolState = 1
      const currentTempLinePoints = this.currentTempLine.geometry.attributes.position.array;
      const lastPoint = new THREE.Vector3
      (
        currentTempLinePoints[3], 
        currentTempLinePoints[4], 
        currentTempLinePoints[5]
      )
      
      switch(this.type) { 
        case ToolsId.AXES:
          this.model.drawTool.toolState = 1 
          break;
        default:
          const tempLinePoints = Array(2).fill(lastPoint);  
          this.initTempLine(tempLinePoints) 
          this.model.drawTool.toolState = 3
          break;
      }
    }
    else if(this.model.drawTool.toolState === 3)
    {
      this.createLine(this.model.drawTool.toolState)
      
      const currentTempLinePoints = this.currentTempLine.geometry.attributes.position.array;
      const lastPoint = new THREE.Vector3
      (
        currentTempLinePoints[3], 
        currentTempLinePoints[4], 
        currentTempLinePoints[5]
      )
      const tempLinePoints =  Array(2).fill(lastPoint);
      this.initTempLine(tempLinePoints)
    }
  };
  
  private _onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.model.drawTool.stop()
      this.removeTempLine()
    }
  };
  

  initTempLine = (points: Array<THREE.Vector3>) => {
		const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineDashedMaterial( {
      color: new THREE.Color( 0x000000 ),
      scale: 1,
      dashSize: 0.5,
      gapSize: 0.05,
    });
    
    const line = new THREE.Line( geometry, material)
  	line.computeLineDistances();
		this.model.scene.add(line)
    this.currentTempLine = line
    // this.tagsManager.init(this.currentTempLine)
    // this.tagsManager.initContainers()

  };

  updTempLine(pointerCoords: THREE.Vector3)
  {
    const linePoints = this.currentTempLine.geometry.attributes.position.array
    const xVector = new THREE.Vector3(1, 0, 0)
    const zVector = new THREE.Vector3(0, 0, 1)
    const yVector = new THREE.Vector3(0, 1, 0)
    const lineVector = new THREE.Vector3
    (
      pointerCoords.x - linePoints[0], 
      pointerCoords.y - linePoints[1], 
      pointerCoords.z - linePoints[2]
    )

    const dotProduct = xVector.dot(lineVector)
    const lineLength = lineVector.length()
    const cosAngle = dotProduct / lineLength
    const angleRad = Math.acos(cosAngle)
    const angleDeg = angleRad * 180 / Math.PI

    if(this.onOrthoMode)
    {
      if(angleDeg < 45 || angleDeg > 135 ) // project on X
       {
        linePoints[3] = pointerCoords.x ; 
        linePoints[4] =  pointerCoords.y; 
        linePoints[5] =  linePoints[2]; 
      }
      else  // project on Z
        {
        linePoints[3] = linePoints[0] ; 
        linePoints[4] =  pointerCoords.y; 
        linePoints[5] =  pointerCoords.z; 
      }
    }
    else
    {
      linePoints[3] = pointerCoords.x ; 
      linePoints[4] =  pointerCoords.y; 
      linePoints[5] =  pointerCoords.z; 
    }
    
    this.currentTempLine.computeLineDistances();
    this.currentTempLine.geometry.attributes.position.needsUpdate = true;
    
  }

  removeTempLine()
  {
  
    this.model.scene.remove(this.currentTempLine)
    // this.tagsManager.removeLineLengthTag()
  }

  createLine(toolState : number)
  {
    const points = this.currentTempLine.geometry.attributes.position.array as Float32Array;
    const geometry = new LineGeometry();
    geometry.setPositions(points);
    const style =
    {
      color : styles[this.type].color,
      dashSize : styles[this.type].dashSize,
      gapSize : styles[this.type].gapSize,
      linewidth : styles[this.type].lineWidth,
    }
    const material = new LineMaterial(style);
    const line = new Line2(geometry,material);
    line.computeLineDistances();
    // const lineLength = getLineLength(line)
    // const meanPoint = getLineMeanPoint(line)

      // const boxGeometry = new THREE.BoxGeometry( 0.5, lineLength, 0.5 ); 
      // const boxMaterial = new THREE.MeshStandardMaterial( {  color: 0xc3c3c3, wireframe: false,} ); 
    // const cube = new THREE.Mesh( boxGeometry, boxMaterial );
    
    // cube.castShadow = true;
    // const rotation = getLineRotation(line)

    // cube.position.x = meanPoint.x
    // cube.position.y = meanPoint.y
    // cube.position.z = meanPoint.z
    // const xAxis = new THREE.Vector3(1, 0, 0)
    // const yAxis = new THREE.Vector3(0, 1, 0);
    // const zAxis = new THREE.Vector3(0, 0, 1);
   
    this.model.scene.add(line)
    // this.model.scene.add( cube );
    // cube.setRotationFromAxisAngle(zAxis, Math.PI - rotation.y )
    // this.sceneController.pickableObjects.push()
    // const coorArray = this.currentTempLine.geometry.attributes.position.array

    // const firstNode  = new THREE.Vector3(coorArray [0], coorArray [1], coorArray [2],) 
    // const secondNode  = new THREE.Vector3(coorArray [3], coorArray [4], coorArray [5],) 
    
    if(toolState === 2 )
    {
      // this.createNode(firstNode)
      // this.createNode(secondNode)
    }
    else if(toolState === 3) 
    {
      // this.createNode(secondNode)
    }
    
    this.removeTempLine()    
  }

  getMouseLocation (
    event : MouseEvent,  
    canvas : HTMLCanvasElement, 
    plane: THREE.Plane, 
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera) {
      
      const rect = canvas.getBoundingClientRect();
      const _vec2 = new THREE.Vector2();
      const _vec3 = new THREE.Vector3();
      const raycaster = new THREE.Raycaster();
      _vec2.x = (( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1);
      _vec2.y =  -( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
      raycaster.setFromCamera(_vec2, camera);
  
      raycaster.ray.intersectPlane(plane, _vec3);
      return _vec3
  }

  enableOrthoMode = () => {
    this.onOrthoMode = true;
  }
  disableOrthoMode = () => {
    this.onOrthoMode = false;
  }

  setType = (type: ToolsId) => {
    this.type = type
  }
}
