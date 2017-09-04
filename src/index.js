'use strict';

import Templater from './Templater';


let CONFIG;


export default class {

    /**
     * configuration for all instance of Templater
     * @public
     * @return itself
     */
    static configure (config) {

        if (!config) {
            throw new Error('configuration is missing');
        }

        if (!config.templates_dir) {
            throw new Error('templates directory is missing');
        }

        // make it end in trailing slash
        if (config.templates_dir.substr(-1) !== '/') {
            config.templates_dir += '/';
        }

        CONFIG = config;

        return true;
    }


    static get make () {

        if (!CONFIG) {
            throw new Error('Configuration is missing. Call templater.configure()');
        }

        return new Templater(CONFIG);
    }


    static get Templater () {
        return Templater;
    }
}
