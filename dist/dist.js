(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var baseVert = require('./../shader/base.vert');
var baseFrag = require('./../shader/base.frag');

var notWebGL = function notWebGL() {
    // webGL非対応時の記述
    console.log('this browser does not support webGL');
};

if (document.getElementsByTagName('html')[0].classList.contains('no-webgl')) {
    notWebGL();
}

// three.jsのとき
try {
    var renderer = new THREE.WebGLRenderer();
} catch (e) {
    notWebGL();
}

// 返ってくる値を確認してみましょう！
console.log(ubu.detect);
// IEの時
if (ubu.detect.browser.ie) {
    console.log('IEさん、動画テクスチャはちょっと…無理ですね…');
}

window.onload = function () {

    var renderer;
    var camera, scene;
    var theta = 0;
    var clock = new THREE.Clock();
    var composer;
    var customPass;

    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var aspect = windowWidth / windowHeight;

    //uniform用
    var time = 0.0;

    //loader
    var loader = new THREE.TextureLoader();

    init();

    function init() {

        // rendererの作成
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(0xffffff), 1.0);

        // canvasをbodyに追加
        document.body.appendChild(renderer.domElement);

        // canvasをリサイズ
        renderer.setSize(windowWidth, windowHeight);

        // ベースの描画処理（renderTarget への描画用）
        scene = new THREE.Scene();

        //LIGHTS
        var light = new THREE.AmbientLight(0xffffff, 1.0);
        scene.add(light);

        //ベースの描画処理用カメラ                      
        camera = new THREE.PerspectiveCamera(60, windowWidth / windowHeight, 0.1, 1000);
        camera.position.z = 1.5;

        var material = new THREE.MeshPhongMaterial({
            map: loader.load('./images/img.jpg')
        });
        var geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        composer = new THREE.EffectComposer(renderer);

        //現在のシーンを設定
        var renderPass = new THREE.RenderPass(scene, camera);
        composer.addPass(renderPass);
        //カスタムシェーダー
        var myEffect = {
            uniforms: {
                'tDiffuse': {
                    value: null
                },
                'time': {
                    type: 'f',
                    value: time
                },
                'resolution': {
                    type: 'v2',
                    value: new THREE.Vector2(windowWidth, windowHeight)
                }
            },
            vertexShader: baseVert,
            fragmentShader: baseFrag

            //エフェクト結果をスクリーンに描画する
        };customPass = new THREE.ShaderPass(myEffect);
        customPass.renderToScreen = true;
        composer.addPass(customPass);

        render();
    }

    function render() {

        time = clock.getElapsedTime();
        customPass.uniforms.time.value = time;

        composer.render();

        requestAnimationFrame(render);
    }
};

},{"./../shader/base.frag":2,"./../shader/base.vert":3}],2:[function(require,module,exports){
module.exports = "#ifdef GL_ES\nprecision mediump float;\n#endif\n\nvarying vec2 vUv; \nuniform float time;\nuniform sampler2D tDiffuse;\nuniform vec2 resolution;\n\n\nvoid main( void ) \n{\n    \n    const float shakeLength = 0.1;\n    const float speed = 1.0;\n    const float shakeWidth = 0.01;\n\n    float offsetX = sin(gl_FragCoord.x * shakeLength + time * speed) * shakeWidth;\n    float offsetY = cos(gl_FragCoord.y * shakeLength + time * speed) * shakeWidth;\n\n    vec4 color = texture2D(tDiffuse, vec2(vUv.x + offsetX , vUv.y + offsetY));\n    gl_FragColor = color; \n}\n\n\n";

},{}],3:[function(require,module,exports){
module.exports = "\n\nvarying vec3 vNormal;\nvarying vec2 vUv;\n\nvoid main() {\n  vUv = uv; \n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}";

},{}]},{},[1]);
