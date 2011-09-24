/**
 * Copyright (C) 2011 by Paul Lewis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * What's our scope here? World? Universe? City? Hello City? That's not right... Although
 * it is a song by the Barenaked Ladies. It's ok, but not as good as some of
 * their other songs. Like Brian Wilson, or The Old Apartment.
 */
var AEROTWIST       = AEROTWIST || {};
AEROTWIST.A3        = AEROTWIST.A3 || {};
AEROTWIST.A3.Sample = new function() {

  // internal vars
  var $container    = $('#container'),

      renderer      = null,
      scene         = null,
      camera        = null,
      width         = $container.width(),
      height        = $container.height(),
      aspect        = width / height,
      monkey        = null,
      callbacks     = null,
      mouseDown     = false,
      lastMouseX    = null,
      lastMouseY    = null,


  // set some constants
      SCALE         = 100,
      DEPTH         = 500,
      NEAR          = 0.1,
      FAR           = 3000,
      VIEW_ANGLE    = 45;

  /**
   * Initialize the scene
   */
  this.init = function() {

    var loader = new A3.MeshLoader("../models/monkey-low.a3", function(geometry) {

        geometry.colors = [];

        for(var v = 0; v < geometry.vertices.length; v++) {
          geometry.colors.push(new A3.V3(1,1,1));
          geometry.vertices[v].position.x *= SCALE;
          geometry.vertices[v].position.y *= SCALE;
          geometry.vertices[v].position.z *= SCALE;
        }

        geometry.updateVertexPositionArray();
        geometry.updateVertexColorArray();

        setup();
        createObjects(geometry);
        addEventListeners();
        render();
        console.log(geometry);
    });

    loader.load();
  };

  /**
   * Sets up the scene, renderer and camera.
   */
  function setup() {
    renderer  = new A3.R(width, height);
    scene     = new A3.Scene();
    camera    = new A3.Camera();

    // Orthographic parameter order: left, right, top, bottom, near, far
    camera.projectionMatrix.orthographic(-width / 2, width / 2, height / 2, -height / 2, NEAR, FAR);

    camera.position.z = DEPTH;

    $container.append(renderer.domElement);
    $container.bind('selectstart', false);
  }

  /**
   * Seriously, read the function name. Take a guess.
   */
  function createObjects(geometry) {

    monkey = new A3.Mesh({
      geometry: geometry,
      shader: A3.ShaderLibrary.get({type:"Normals"})
    });

    scene.add(monkey);
  }

  /**
   * Sets up the event listeners so we
   * can click and drag the monkey round
   */
  function addEventListeners() {

    /*
     * Set up the callbacks
     */
    callbacks = {

      /**
       * When the mouse is depressed
       */
      onMouseDown: function(event) {
        mouseDown = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
      },

      /**
       * When the mouse has cheered up
       */
      onMouseUp: function(event) {
        mouseDown = false;
      },

      /**
       * When the mouse gets his boogie on
       */
      onMouseMove: function(event) {

        if(mouseDown) {
          var thisMouseX = event.clientX;
          var thisMouseY = event.clientY;

          monkey.rotation.x += (thisMouseY - lastMouseY) * 0.01;
          monkey.rotation.y += (thisMouseX - lastMouseX) * 0.01;

          lastMouseY = thisMouseY;
          lastMouseX = thisMouseX;
        }
      },

      onWindowResize: function() {

        width         = $container.width();
        height        = $container.height();
        aspect        = width / height;

        renderer.resize(width, height);
        camera.projectionMatrix.perspective(VIEW_ANGLE, aspect, NEAR, FAR);

      }
    };

    $container.mousedown(callbacks.onMouseDown);
    $container.mouseup(callbacks.onMouseUp);
    $container.mousemove(callbacks.onMouseMove);
    $(window).resize(callbacks.onWindowResize);

  }

  /**
   * Do a render
   */
  function render() {

    requestAnimFrame(render);
    renderer.render(scene, camera);

  }
};

AEROTWIST.A3.Sample.init();
