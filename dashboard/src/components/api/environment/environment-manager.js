/*
 * Copyright (c) 2015-2016 Codenvy, S.A.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Codenvy, S.A. - initial API and implementation
 */
'use strict';

/**
 * This is base class, which describes the environment manager.
 * It's aim is to handle machines retrieval and editing, based on the type of environment.
 */
export class EnvironmentManager {

  constructor() {
    this.WS_AGENT_NAME = 'org.eclipse.che.ws-agent';
  }

  get canDeleteMachine() {
    return false;
  }

  get canEditEnvVariables() {
    return false;
  }

  /**
   * Retrieves the list of machines.
   *
   * @param environment environment's configuration
   * @returns {Array} list of machines defined in environment
   */
  getMachines(environment) {
    return [];
  }

  /**
   * Provides the environment configuration based on machines format.
   *
   * @param environment origin of the environment to be edited
   * @param machines the list of machines
   * @returns environment's configuration
   */
  getEnvironment(environment, machines) {
    machines.forEach((machine) => {
      let machineName = machine.name;

      if (angular.isUndefined(environment.machines[machineName])) {
        environment.machines[machineName] = {'attributes': {}};
      }
      environment.machines[machineName].attributes.memoryLimitBytes = machine.attributes.memoryLimitBytes;
      environment.machines[machineName].agents = angular.copy(machine.agents);
      environment.machines[machineName].servers = angular.copy(machine.servers);
    });

    return environment;
  }

  /**
   * Returns whether machine is developer or not.
   *
   * @param machine
   * @returns {*}
   */
  isDev(machine) {
    return machine && machine.agents && machine.agents.includes(this.WS_AGENT_NAME);
  }

  /**
   * Set machine as developer one - contains 'ws-agent' agent.
   *
   * @param machine machine to edit
   * @param isDev defined whether machine is developer or not
   */
  setDev(machine, isDev) {
    let hasWsAgent = this.isDev(machine);
    if (isDev && !hasWsAgent) {
      machine.agents = machine.agents ? machine.agents : [];
      machine.agents.push(this.WS_AGENT_NAME);
      return;
    }

    if (!isDev && hasWsAgent) {
      machine.agents.splice(machine.agents.indexOf(this.WS_AGENT_NAME), 1);
    }
  }

  getServers(machine) {
    if (machine && machine.servers) {
      return machine.servers;
    }

    return {};
  }

  setServers(machine, servers) {
    machine.servers = angular.copy(servers);
  }

  getMemoryLimit(machine) {
    if (machine && machine.attributes && machine.attributes.memoryLimitBytes) {
      return machine.attributes.memoryLimitBytes;
    }

    return -1;
  }

  /**
   * Sets the memory limit of the pointed machine.
   * Value in attributes has the highest priority,
   *
   * @param machine machine to change memory limit
   * @param limit memory limit
   */
  setMemoryLimit(machine, limit) {
    machine.attributes = machine.attributes ? machine.attributes : {};
    machine.attributes.memoryLimitBytes = limit;
  }

  renameMachine(environment, oldName, newName) {
    environment.machines[newName] = environment.machines[oldName];
    delete environment.machines[oldName];
  }
}
