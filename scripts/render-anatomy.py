# HuBMAP Human Reference Atlas: Kristen Browne and Heidi Schlehlein, CC BY 4.0.
# Render an illustrative model, isolated with alpha for compositing in Remotion.
import bpy, math
from pathlib import Path
root = Path(__file__).resolve().parent.parent
from mathutils import Vector
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
for name in ['VH_F_Lung.glb','VH_F_Heart.glb']:
 bpy.ops.import_scene.gltf(filepath=str(root / 'artifacts' / 'anatomy' / name))
bpy.context.view_layer.update()
keep=[]
for o in list(bpy.data.objects):
 if o.type!='MESH': continue
 n=o.name.lower()
 if 'bronchopulmonary_seg' in n or n in ['vh_f_trachea','vh_f_left_ventricle','vh_f_right_ventricle','vh_f_left_cardiac_atrium','vh_f_right_cardiac_atrium']:
  keep.append(o)
 else: bpy.data.objects.remove(o,do_unlink=True)

def make_material(name,color):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True; nodes=m.node_tree.nodes; p=nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=.41;p.inputs['Subsurface Weight'].default_value=.16;p.inputs['Subsurface Radius'].default_value=(1,.30,.19)
 noise=nodes.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=320;noise.inputs['Detail'].default_value=2;noise.inputs['Roughness'].default_value=.65
 bump=nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.08;bump.inputs['Distance'].default_value=.00015
 m.node_tree.links.new(noise.outputs['Fac'],bump.inputs['Height']);m.node_tree.links.new(bump.outputs['Normal'],p.inputs['Normal']);return m
lung=make_material('Pulmonary tissue',(.42,.15,.17)); heart=make_material('Cardiac tissue',(.28,.055,.065)); airway=make_material('Airway',(.54,.33,.31))
for o in keep:
 n=o.name.lower(); o.data.materials.clear();o.data.materials.append(airway if n=='vh_f_trachea' else lung if 'bronchopulmonary_seg' in n else heart)
 for p in o.data.polygons:p.use_smooth=True
 if 'bronchopulmonary_seg' in n:
  mod=o.modifiers.new('Smooth','SUBSURF');mod.levels=1;mod.render_levels=1
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=32;scene.cycles.use_denoising=False
scene.render.resolution_x=960;scene.render.resolution_y=540;scene.render.resolution_percentage=100;scene.render.film_transparent=True
scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA';scene.render.image_settings.color_depth='8';scene.render.fps=30
scene.view_settings.view_transform='AgX'
world=bpy.data.worlds.new('Dark studio');scene.world=world;world.use_nodes=True;world.node_tree.nodes['Background'].inputs['Color'].default_value=(.04,.08,.12,1);world.node_tree.nodes['Background'].inputs['Strength'].default_value=.22

def point(obj,target):obj.rotation_euler=(Vector(target)-obj.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(-.015,-.95,.54));cam=bpy.context.object;point(cam,(0,.08,.49));cam.data.type='ORTHO';cam.data.ortho_scale=.43;scene.camera=cam
for name,loc,power,size,color in [('Key',(-.35,-.5,.8),24,.35,(.75,.88,1)),('Warm',(.35,-.28,.5),12,.25,(1,.65,.48)),('Rim',(.15,.35,.75),22,.24,(.25,.6,1))]:
 data=bpy.data.lights.new(name,'AREA');data.energy=power;data.shape='DISK';data.size=size;data.color=color;o=bpy.data.objects.new(name,data);scene.collection.objects.link(o);o.location=loc;point(o,(0,.08,.48))
scene.render.filepath=str(root / 'public' / 'pleural-demo' / 'hubmap-anatomy.png');bpy.ops.render.render(write_still=True)
