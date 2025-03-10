import { Model } from '../../Model';
import * as THREE from 'three';
import { ToolsId, styles, Tool } from '../types';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import Beam from '../../Elements/Beam/Beam';
import Node from '../../Elements/Node/Node';
import Column from '../../Elements/Column/Column';
// type LineType = 'Axis' | 'Beam' | 'Column';
const mockLevels = [
  { value: 0, label: 'Level 1' },
  { value: 3, label: 'Level 2' },
  { value: 6, label: 'Level 3' },
];

export class Line implements Tool {
  lineMode: number;
  lineSegments: number;
  currentTempLine : THREE.Line;
  model : Model 
  currentPointerCoord : THREE.Vector3;
  onOrthoMode : boolean;
  type : String;
  startNode: Node
  endNode: Node
  snappedNode : Node | null
  constructor(model : Model) 
  {
    this.model = model
    this.lineMode = 0; //0: 2-pt line, 1: polyline //3: Axes
    this.lineSegments = 1;
    this.currentTempLine = new THREE.Line()
    this.currentPointerCoord = new THREE.Vector3();
    this.onOrthoMode = true;
    this.type = 'Beam';
    this.startNode = new Node(this.model, new THREE.Vector3())
    this.endNode = new Node(this.model, new THREE.Vector3())
    this.snappedNode = null
  }

  start = (type: String) => {
    this.type = type
    this.model.canvas.addEventListener('mousemove', this._onMouseMove);
    this.model.canvas.addEventListener('click', this._onDrawClick);
    window.addEventListener('keydown', this._onKey);
  };

  private _onMouseMove = (e: MouseEvent) => {
    const mouseLoc = this.getMouseLocation(e,this.model.canvas, this.model.worldPlane, this.model.camera.cam);
    this.currentPointerCoord = mouseLoc;
    if (this.model.drawTool.state === 1) {
      this.currentPointerCoord = mouseLoc;
    }

    if (this.model.drawTool.state === 2 ||  this.model.drawTool.state === 3) {
      this.updTempLine(this.currentPointerCoord)
    }
  }

  private _onDrawClick = () => {
    //ON FIRST CLICK
    if (this.model.drawTool.state === 1) {
      let tempPointerCoord = this.currentPointerCoord
      if(this.model.snapper.enabled)
      {
        this.snappedNode = this.model.snapper.snappedNode
        tempPointerCoord = this.model.snapper.snappedCoords!

        if(this.type === 'Column' && this.snappedNode){
          const topNode = this.snappedNode
          const currentLayer = this.model.layer
          const currentLevel = mockLevels[currentLayer].value
          const lowerLevel = mockLevels[currentLayer - 1].value
          let bottomNode = this.model.nodes.find(node => node.y === lowerLevel && node.x === topNode.x && node.z === topNode.z)

          console.log('BOTTOM NODE', bottomNode)

          
            if(!bottomNode) 
              bottomNode = new Node(this.model, new THREE.Vector3(topNode.x, lowerLevel, topNode.z))
            
            const newColumn = new Column(this.model, 'Column', [topNode, bottomNode])
            newColumn.create()
            this.model.nodes.push(bottomNode)
            this.model.columns.push(newColumn)
            return
        }
      }      
      const   tempLinePoints =  Array(2).fill(tempPointerCoord); 
      this.initTempLine(tempLinePoints)
      this.model.drawTool.state = 2;
    }
    else if (this.model.drawTool.state === 2) {
      this.createLine(this.model.drawTool.state)
      const currentTempLinePoints = this.currentTempLine.geometry.attributes.position.array;
      const lastPoint = new THREE.Vector3
      (
        currentTempLinePoints[3], 
        currentTempLinePoints[4], 
        currentTempLinePoints[5]
      )
      
      switch(this.type) { 
        case 'Axis':
          this.model.drawTool.state = 1 
          break;
        default:
          const tempLinePoints = Array(2).fill(lastPoint);  
          this.initTempLine(tempLinePoints) 
          this.model.drawTool.state = 3
          break;
      }
    }
    else if(this.model.drawTool.state === 3)
    {
      this.createLine(this.model.drawTool.state)
      
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
      this.dispose()
    }
  };
  

  initTempLine = (points: Array<THREE.Vector3>) => {
		const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial( {
      color: new THREE.Color( 0x000000 ),
      // dashSize: 0.5,
      // gapSize: 0.05,
    });
    
    const line = new THREE.Line( geometry, material)
  	// line.computeLineDistances();
		this.model.scene.add(line)
    this.currentTempLine = line
    line.layers.enableAll()
    // this.tagsManager.init(this.currentTempLine)
    // this.tagsManager.initContainers()

  };

  updTempLine(pointerCoords: THREE.Vector3)
  {
    
    if(this.model.snapper.enabled)
    {
      const snappedCoords = this.model.snapper.snappedCoords!
      pointerCoords = snappedCoords
    }
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
    
    // this.currentTempLine.computeLineDistances();
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
    const type = this.type as keyof typeof styles
    const style =
    {
      color : styles[type].color,
      dashSize : styles[type].dashSize,
      gapSize : styles[type].gapSize,
      linewidth : styles[type].lineWidth,
    }
    const material = new LineMaterial(style);
    const line = new Line2(geometry,material);
    // line.computeLineDistances();
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
    switch(this.type) 
    {
      case 'Axis':
        this.model.axes.draw(points)
        break;
      case 'Beam':

    
        if(toolState === 2) {
          console.log('POINT 1', points[0], points[1], points[2])
          console.log('POINT 2', points[3], points[4], points[5])
          const nodei = this.snappedNode ? this.snappedNode : new Node(this.model, new THREE.Vector3(points[0], points[1], points[2]))
          const nodej = new Node(this.model, new THREE.Vector3(points[3], points[4], points[5]))
          nodej.id = nodei.id - 1 


          const nodes = [nodei, nodej]
          if(!this.snappedNode)
          {
            this.model.nodes.push(nodei)
          }
          this.model.nodes.push(nodej)
          
          const beam = new Beam(this.model, 'Beam', nodes)
          beam.create()
          this.model.beams.push(beam)
          this.model.drawTool.handleBeamDraw(beam, toolState)
        }
        else if(toolState === 3) {
          const currentNodes = this.model.nodes
          const previousNode = this.model.nodes[this.model.nodes.length - 1]
          const nodei = previousNode
          const snappedNode = this.model.snapper.snappedNode
          const nodej = snappedNode ? snappedNode : new Node(this.model, new THREE.Vector3(points[3], points[4], points[5]))
          const nodes = [nodei, nodej]
          const beam = new Beam(this.model, 'Beam', nodes)
          beam.create()
          this.model.beams.push(beam)
          console.log('NODES', this.model.nodes)

          if (!snappedNode)  
            this.model.nodes = [...currentNodes, nodej]

          console.log('NODES', this.model.nodes)
          this.model.drawTool.handleBeamDraw(beam, toolState)
        }
        break;
      default:
        this.model.scene.add(line)
        break;
    }
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

  setType = (type: String) => {
    this.type = type
  }

  dispose = () => {
    this.removeTempLine()
    this.model.canvas.removeEventListener('mousemove', this._onMouseMove);
    this.model.canvas.removeEventListener('click', this._onDrawClick);
    window.removeEventListener('keydown', this._onKey);
  }
}
