"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ECS = void 0;
class ECS {
  #count;
  #list;
  #component;
  constructor() {
    this.#count = 0;
    this.#list = [];
    this.#component = {};
  }
  #generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0,
        v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  }
  create() {
    const id = this.#generateUUID();
    this.#list[this.#count++] = id;
    return id;
  }
  createWithId(id) {
    this.#list[this.#count++] = id;
    return id;
  }
  release(entity) {
    const index = this.#list.indexOf(entity);
    if (index === -1) {
      return;
    }
    this.#list.splice(index, 1);
    this.#count--;

    // Remove all components associated with the entity
    Object.values(this.#component).forEach(componentMap => {
      if (componentMap[entity]) {
        delete componentMap[entity];
      }
    });
  }
  valid(entity) {
    return this.#list.indexOf(entity) !== -1;
  }
  getAllEntities() {
    return this.#list;
  }

  // component functions
  emplace(entity, component) {
    if (!this.valid(entity)) {
      return;
    }
    if (!this.#component[component.type]) {
      this.#component[component.type] = {};
    }
    this.#component[component.type][entity] = component;
    return component;
  }
  remove(entity, componentType) {
    if (!this.valid(entity) || !this.#component[componentType]) {
      return;
    }
    delete this.#component[componentType][entity];
  }
  clear() {
    this.#list = [];
    this.#count = 0;
    this.#component = {};
  }
  has(entity, componentType) {
    if (!this.#component[componentType]) {
      this.#component[componentType] = {};
    }
    return this.#component[componentType][entity] != null;
  }
  get(entity, componentType) {
    if (!this.valid(entity) || !this.#component[componentType]) {
      return;
    }
    return this.#component[componentType][entity] || null;
  }
  getAll(componentType) {
    if (!this.#component[componentType]) {
      return [];
    }
    return Object.values(this.#component[componentType]);
  }
  getAllWithEntity(componentType) {
    if (!this.#component[componentType]) {
      return {};
    }
    return this.#component[componentType];
  }
  group() {
    for (var _len = arguments.length, componentType = new Array(_len), _key = 0; _key < _len; _key++) {
      componentType[_key] = arguments[_key];
    }
    const entities = this.#list.filter(entity => componentType.every(componentType => this.#component[componentType] && this.#component[componentType][entity]));
    const groupedComponents = [];
    for (let i = 0; i < entities.length; i++) {
      groupedComponents.push([]);
      for (let j = 0; j < componentType.length; j++) {
        const component = this.get(entities[i], componentType[j]);
        groupedComponents[i].push(component);
      }
    }
    return groupedComponents;
  }
}
exports.ECS = ECS;