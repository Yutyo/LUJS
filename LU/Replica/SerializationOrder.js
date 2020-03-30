const Components = require('./Components');

/**
 *
 * @type {Number[]}
 */
const SerializationOrder = [
  Components.UNKNOWN_108_COMPONENT,
  Components.MODULE_ASSEMBLY_COMPONENT,
  Components.CONTROLABLE_PHYSICS_COMPONENT,
  Components.SIMPLE_PHYSICS_COMPONENT,
  Components.RIGID_BODY_PHANTOM_PHYSICS_COMPONENT,
  Components.VEHICLE_PHYSICS_COMPONENT,
  Components.PHANTOM_PHYSICS_COMPONENT,
  Components.DESTRUCTABLE_COMPONENT,
  Components.COLLECTIBLE_COMPONENT,
  Components.PET_COMPONENT,
  Components.CHARACTER_COMPONENT,
  Components.SHOOTING_GALLERY_COMPONENT,
  Components.INVENTORY_COMPONENT,
  Components.SCRIPT_COMPONENT,
  Components.SKILL_COMPONENT,
  Components.BASE_COMBAT_AI_COMPONENT,
  Components.REBUILD_COMPONENT,
  Components.MOVING_PLATFORM_COMPONENT,
  Components.SWITCH_COMPONENT,
  Components.VENDOR_COMPONENT,
  Components.BOUNCER_COMPONENT,
  Components.SCRIPTED_ACTIVITY_COMPONENT,
  Components.RACING_CONTROL_COMPONENT,
  Components.LUP_EXHIBIT_COMPONENT,
  Components.MODEL_BEHAVIORS_COMPONENT,
  Components.RENDER_COMPONENT,
  Components.MINIGAME_COMPONENT,
  Components.UNKNOWN_107_COMPONENT,
  Components.TRIGGER_COMPONENT,

  // Below here are the components that aren't actually serialized, but we need them for the object to think it is ready to go
  Components.ROCKET_LANDING_COMPONENT,
  Components.SOUND_AMBIENT_2D_COMPONENT
];

module.exports = SerializationOrder;
