'use strict';

import Templater from './Templater';
import i18n from 'anytv-i18n';


let CONFIG;


export default class {

    /**
     * configuration for all instance of Templater
     * @public
     * @return itself
     */
    static configure (config) {

        if (!config.templates_dir) {
            throw new Error('templates directory is missing');
        }

        if (!config.i18n) {
            throw new Error('i18n config is missing');
        }

        // make it end in trailing slash
        if (config.templates_dir.substr(-1) !== '/') {
            config.templates_dir += '/';
        }

        i18n.configure(config.i18n)
            .use(config.i18n.project)
            .load();

        CONFIG = config;

        return true;
    }


    static get make () {

        if (!CONFIG) {
            throw new Error('Configuration is missing. Call templater.configure()');
        }

        return new Templater(CONFIG);
    }

    static Templater () {
        return Templater;
    }
}
