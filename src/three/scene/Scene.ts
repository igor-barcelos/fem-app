import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import * as BUI from "@thatopen/ui";
import * as THREE from "three"
import selection from "../../components/Toolbars/Sections/Selection";
let world : any
export class Scene {
  constructor() {
    
  }
  async init()
  {
    BUI.Manager.init();

    const canvas = document.querySelector('canvas')
    const container = document.getElementById("root") as HTMLDivElement
    
    if(canvas)
      return
    const components = new OBC.Components();
    const worlds = components.get(OBC.Worlds);
    world = worlds.create<
    OBC.SimpleScene,
    OBC.SimpleCamera,
    OBCF.PostproductionRenderer
    >();
    
    world.scene = new OBC.SimpleScene(components);
    world.renderer= new OBCF.PostproductionRenderer(components, container)
    world.camera = new OBC.SimpleCamera(components);

    components.init();

    const ambientLight = new THREE.AmbientLight(0xE6E7E4, 1)
    const directionalLight = new THREE.DirectionalLight(0xF9F9F9, 0.75)
    directionalLight.position.set(10, 50, 10)
    world.scene.three.add(ambientLight, directionalLight)
    world.scene.three.background = new THREE.Color("#202932")

    const grid = components.get(OBC.Grids).create(world);
    grid.fade = true;

    const { postproduction } = world.renderer;
    postproduction.enabled = true;
    postproduction.customEffects.excludedMeshes.push(grid.three);

    // const casters = components.get(OBC.Raycasters);
    // const caster = casters.get(world);

    // const mainToolbar = new BUI.Toolbar()

    const toolbar = BUI.Component.create(() => {
      return BUI.html`
        <bim-toolbar class="options-menu">
          ${selection(components, world)}
        </bim-toolbar>
      `
    })

    const app = document.getElementById('root') as HTMLElement
    app.append(toolbar);
  }

  loadToolBar()
  {

  }
}

export const getWorld = () => world;