// @ts-nocheck
"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/* eslint-disable no-shadow */

/**
 * Create pixelated flames
 */
let initFlames = function(){
    let canvas;
    let ctx;
    let config = {
        meanSparkSize: 0.012
    };

    /**
     * On-Resize event
     */
    let resize = window.resize = function(){
        canvas.height = document.body.offsetHeight;
        canvas.width = document.body.offsetWidth;
    };

    /**
     * Spark - A single spark
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {Number} x
     * @param {Number} y
     * @param {Object} config
     */
    let Spark = function Spark(ctx, x, y, config){
        this.ctx = ctx;
        this.pos = [ x, y ];
        this.size = config.meanSparkSize + (Math.random() - 0.5) * 5;
        this.v = [
            2 * (Math.random() - 0.5),
            -1 * 6 * Math.random()
        ];
        this.c = [
            Math.floor(Math.random() * 155) + 100,
            Math.floor(Math.random() * 80),
            0
        ];
        this.life = this.lifeOrig = Math.floor(200 * Math.random());
        this.config = config;
    };

    /**
     * Move a spark
     */
    Spark.prototype.move = function(){
        for (let i = 0; i < 2; i++) this.pos[i] += this.v[i] * (1 - this.life / this.lifeOrig);
    };

    /**
     * get alpha value of spark
     *
     * @returns {Number}
     */
    Spark.prototype.getAlpha = function(){
        return Math.sqrt(this.life / this.lifeOrig) + ((Math.random() - 0.5) / 10);
    };

    /**
     * Update spark
     *
     * @returns {null}
     */
    Spark.prototype.update = function(){
        this.move();
        if (!(this.life--)) return true;
        this.ctx.beginPath();
        this.ctx.rect(this.pos[0], this.pos[1], this.size, this.size);
        this.ctx.fillStyle = `rgba(${this.c[0]}, ${this.c[1]}, ${this.c[2]}, ${this.getAlpha()})`;
        this.ctx.fill();
        return null;
    };

    /**
     * Create flames
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {HTMLElement} canvas
     * @param {number} y
     * @param {object} config
     */
    let Fire = function Fire(ctx, canvas, y, config){
        this.ctx = ctx;
        this.canvas = canvas;
        this.y = y;
        this.r = 255;
        this.config = config;
        this.sparks = [ ];
    };

    /**
     * Add a spark to the flame
     *
     * @param {number} x
     */
    Fire.prototype.spark = function(x){
        this.sparks.push(new Spark(this.ctx, x, this.y, this.config));
    };

    /**
     * Update the flame hue
     */
    Fire.prototype.updateColor = function(){
        this.r += (Math.random() - 0.5) * 10;
        this.r = Math.round(Math.min(80, Math.max(60, this.r)));
    };

    /**
     * Flame update iterator
     */
    Fire.prototype.update = function(){
        this.updateColor();
        this.ctx.beginPath();
        this.ctx.rect(0, this.y, this.canvas.width, this.config.meanSparkSize);
        this.ctx.fillStyle = `rgba(${this.r}, 0, 0, 1)`;
        this.ctx.fill();

        for (let i = 0; i < this.sparks.length; i++) (this.sparks[i].update()) && this.sparks.splice(i, 1);
    };

    /**
     * Initialze fire
     */
    window.onload = function(){
        canvas = document.getElementById("main");
        ctx = canvas.getContext("2d");
        resize();

        config.meanSparkSize = canvas.width * config.meanSparkSize;

        let fire = new Fire(ctx, canvas, canvas.height - 14, config);

        /**
         * Spark generator
         */
        let loop = function(){
            window.requestAnimFrame(loop);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            fire.update();
            for (let i = 0; i < 1; i++) fire.spark(Math.random() * canvas.width);
        };

        window.requestAnimFrame = (function(){
            return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            (a => window.setTimeout(a, 1E3 / 60));
        }());

        loop();
    };
};

window.initFlames = initFlames;
