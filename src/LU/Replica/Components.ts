export const Components = {
  CONTROLABLE_PHYSICS_COMPONENT: 1,
  RENDER_COMPONENT: 2,
  SIMPLE_PHYSICS_COMPONENT: 3,
  CHARACTER_COMPONENT: 4, // only two in table
  SCRIPT_COMPONENT: 5,
  BOUNCER_COMPONENT: 6,
  DESTRUCTABLE_COMPONENT: 7,

  SKILL_COMPONENT: 9,
  SPAWNER_COMPONENT: 10, // used for LOT 176, a spawner
  ITEM_COMPONENT: 11, // used for quite a few objects, they vary too much to determine what it is
  MODULAR_BUILD_COMPONENT: 12, // This is for modular building areas, rocket bays and car bays
  REBUILD_START_COMPONENT: 13, // Rebuildables and Thinking hat has this for some reason
  REBUILD_ACTIVATOR_COMPONENT: 14, // only one in table, but no object matches that id
  ICON_ONLY_RENDER_COMPONENT: 15, // only one in table, but no object matches that id
  VENDOR_COMPONENT: 16,
  INVENTORY_COMPONENT: 17,
  PROJECTILE_PHYSICS_COMPONENT: 18, // this is used by shooting gallery objects
  SHOOTING_GALLERY_COMPONENT: 19, // cannon component? Is used by cannon objects
  RIGID_BODY_PHANTOM_PHYSICS_COMPONENT: 20, // Is used by objects in racing

  CHEST_COMPONENT: 22, // Only used by a treasure chest
  COLLECTIBLE_COMPONENT: 23, // used by collectable spawners
  BLUEPRINT_COMPONENT: 24, // used in showing a model in the inventory
  MOVING_PLATFORM_COMPONENT: 25, // Is used by moving platforms, could be a moving platform component
  PET_COMPONENT: 26,
  PLATFORM_BOUNDRY_COMPONENT: 27, // another moving platform component, potentially
  MODULE_COMPONENT: 28, // Modular Component? All the objects are pieces to rockets, etc.
  JET_PACK_PAD_COMPONENT: 29, // JetpackComponent? All objects using this have to do with jetpacks
  VEHICLE_PHYSICS_COMPONENT: 30,
  MOVEMENT_AI_COMPONENT: 31, // only enemies have this for the most part
  EXHIBIT_COMPONENT: 32, // Exhibit Component?

  MINIFIG_COMPONENT: 35, // All NPC's have this component...
  PROPERTY_COMPONENT: 36, // This component is used by property related objects
  PET_NEST_COMPONENT: 37, // only one in table, used by LOT 3336, which is described as a nest asset. Possibly a petNestComponent
  MODEL_BUILDER_COMPONENT: 38, // only two in table, LWOModelBuilderComponent is listed in the description of LOT 6228
  SCRIPTED_ACTIVITY_COMPONENT: 39,
  PHANTOM_PHYSICS_COMPONENT: 40,
  SPRINGPAD_COMPONENT: 41, // A component for testing "new springpads" LOT 4816 for example
  MODEL_BEHAVIORS_COMPONENT: 42, // Models, or something...?
  PROPERTY_ENTRANCE_COMPONENT: 43, // Property Lauchpad components
  FX_COMPONENT: 44, // Not one object uses this
  PROPERTY_MANAGEMENT_COMPONENT: 45, // only one in table, LOT 3315
  VEHICLE_PHYSICS_2_COMPONENT: 46, // Flying vehicle tests component
  PHYSICS_SYSTEM_COMPONENT: 47, // Used by a lot of LUP freebuild objects, LOT 7138
  REBUILD_COMPONENT: 48,
  SWITCH_COMPONENT: 49,
  MINIGAME_COMPONENT: 50, // only two in table, one is the biplane(LOT 4625), the other is LOT 2365, a zone control object
  CHANGLING_COMPONENT: 51, // used by "Kipper Duel"  models...
  CHOICE_BUILD_COMPONENT: 52, // choice build component?
  PACKAGE_COMPONENT: 53, // Loot pack component?
  SOUND_REPEATER_COMPONENT: 54, // only two in table, both are sound objects, this must be a sound component
  SOUND_AMBIENT_2D_COMPONENT: 55, // only two in table, and those are the player objects
  SOUND_AMBIENT_3D_COMPONENT: 56, // only one in table, which is an ambient sound object
  PLAYER_FLAGS_COMPONENT: 57, // used in pirate siege...

  CUSTUM_BUILD_ASSEMBLY_COMPONENT: 59, // only one in table, LOT 6398. a test rocket
  BASE_COMBAT_AI_COMPONENT: 60,
  MODULE_ASSEMBLY_COMPONENT: 61, // used by cars and rockets, modular stuff
  SHOWCASE_MODEL_COMPONENT: 62, // showcase component? (LOT 6545)
  RACING_MODULE_COMPONENT: 63, // another modular related component
  GENERIC_ACTIVATOR_COMPONENT: 64, // only three in table, a middle module component?
  PROPERTY_VENDOR_COMPONENT: 65, // only two in table, property selling venders
  HF_LIGHT_DIRECTION_COMPONENT: 66, // only one in table, LOT 6968, a light direction component?
  ROCKET_LAUNCHPAD_CONTROL_COMPONENT: 67, // launchpad related component
  ROCKET_LANDING_COMPONENT: 68, // only two in table, and those are the player objects
  TRIGGER_COMPONENT: 69, // I assume Simon pulled this from somewhere(?)

  RACING_CONTROL_COMPONENT: 71,
  FACTION_TRIGGER_COMPONENT: 72, // something to do with rank items... maybe to do with skills?
  MISSION_NPC_COMPONENT: 73, // missions giver component?
  RACING_STATS_COMPONENT: 74, // only two in table, racing car related
  LUP_EXHIBIT_COMPONENT: 75, // only one in table, LUP exhibit related, LOT 9461

  SOUND_TRIGGER_COMPONENT: 77, // sound trigger component
  PROXIMITY_MONITOR_COMPONENT: 78, // more launchpad related stuff
  RACING_SOUND_TRIGGER_COMPONENT: 79, // only two in table, sound trigger related

  USER_CONTROL_COMPONENT: 95, // skateboard component

  UNKOWN_97_COMPONENT: 97, // only two in table, both are Starbase 3001 launcher related

  UNKOWN_100_COMPONENT: 100, // brick donation component

  UNKOWN_102_COMPONENT: 102, // only two in table, commendation vendor component?
  UNKOWN_103_COMPONENT: 103, // only two in table, nothing in objects
  RAIL_ACTIVATOR_COMPONENT: 104, // rail activator related
  UNKOWN_105_COMPONENT: 105, // only three in table, ? I haven't a clue as to what this is supposed to be
  UNKOWN_106_COMPONENT: 106, // only one in table, related to skateboard mount, LOT 16684
  UNKNOWN_107_COMPONENT: 107, // only one in table, generic player
  UNKNOWN_108_COMPONENT: 108, // for vehicles

  UNKOWN_113_COMPONENT: 113, // only one in table, property plaque
  UNKOWN_114_COMPONENT: 114, // used by building bays

  UNKOWN_116_COMPONENT: 116, // only one in table, LOT 16512, a culling plane, culls objects behind them

  key: function (value) {
    for (const prop in this) {
      if (this.hasOwnProperty.call(prop)) {
        if (this[prop] === value) return prop;
      }
    }
  }
};
