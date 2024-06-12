import * as THREE from 'three';
import { PlayerService } from './PlayerService';
import { CameraService } from './CameraService';
import { Obstacle } from '../models/Obstacle';

export class GameService {
  private static scene: THREE.Scene;
  private static camera: THREE.PerspectiveCamera;
  private static renderer: THREE.WebGLRenderer;
  private static obstacles: THREE.Group;
  private static platform: THREE.Group;

  static init(containerId: string): void {
    this.scene = new THREE.Scene();
    this.camera = CameraService.init();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById(containerId)?.appendChild(this.renderer.domElement);

    this.createPlatform(10, 10);
    PlayerService.init(this.scene);
    this.createObstacles(5); // initial number of obstacles

    this.addEventListeners();
    this.animate();
  }

  private static createPlatform(width: number, height: number): void {
    this.platform = new THREE.Group();
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0;
    this.platform.add(plane);
    this.scene.add(this.platform);

    this.createGrid(width, height);
  }

  private static createGrid(width: number, height: number): void {
    const grid = new THREE.Group();
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    for (let i = -width / 2; i <= width / 2; i++) {
      const lineGeometryX = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i, 0, -height / 2),
        new THREE.Vector3(i, 0, height / 2)
      ]);
      const lineX = new THREE.Line(lineGeometryX, lineMaterial);
      grid.add(lineX);

      const lineGeometryZ = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-width / 2, 0, i),
        new THREE.Vector3(width / 2, 0, i)
      ]);
      const lineZ = new THREE.Line(lineGeometryZ, lineMaterial);
      grid.add(lineZ);
    }

    this.platform.add(grid);
  }

  private static createObstacles(count: number): void {
    this.obstacles = new THREE.Group();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    for (let i = 0; i < count; i++) {
      const obstacle = new Obstacle(new THREE.Mesh(geometry, material));
      obstacle.mesh.position.set(Math.random() * 10 - 5, 0.5, Math.random() * 10 - 5);
      this.obstacles.add(obstacle.mesh);
    }
    this.scene.add(this.obstacles);
  }

  private static addEventListeners(): void {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  private static handleKeyDown(event: KeyboardEvent): void {
    const moveDistance = 1;
    switch (event.key) {
      case 'ArrowUp':
        PlayerService.movePlayer(new THREE.Vector3(0, 0, -moveDistance));
        break;
      case 'ArrowDown':
        PlayerService.movePlayer(new THREE.Vector3(0, 0, moveDistance));
        break;
      case 'ArrowLeft':
        PlayerService.movePlayer(new THREE.Vector3(-moveDistance, 0, 0));
        break;
      case 'ArrowRight':
        PlayerService.movePlayer(new THREE.Vector3(moveDistance, 0, 0));
        break;
    }
  }

  private static animate(): void {
    requestAnimationFrame(this.animate.bind(this));
    CameraService.followPlayer(PlayerService.getPlayerPosition());
    this.renderer.render(this.scene, this.camera);
  }
}
