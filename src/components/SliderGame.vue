<template>
  <div class="board">
      <canvas ref="pixiTarget" style="max-width:100%;" />
  </div>
</template>

<script>
import {PixiInstance, PixiDraw, PixiUtils, PixiAction} from '../utils/PixiManager.js';
import {getPiecesByProperty, randomizeStructure, checkForWin} from '../utils/GameLogic.js';
import {reshape, gameColors} from '../utils/Utilities.js';
export default {
    props:{
        pattern: Array,
        loaded: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            instance: {},
            draw: new PixiDraw(),
            structure: this.loaded ? this.pattern : randomizeStructure(this.pattern),
            action: new PixiAction(),
            utils: new PixiUtils(),
            colors: gameColors.map(item => Number(`0x${item.split('#').join('')}`)),
            dragger: null,
            dragCycles: 0,
            dragCycleMax: 15,
            dragStart: {x: 0, y: 0},
            dragDirection: null,
            dragGroup: [],
            dragOffsets: [],
            startCenters: [],
            offset: {x: 0, y: 0},
            pieces: [],
            originPoint: {x: 5, y: 50},
            boardSize: {width: 500, height: 500},
            boardBorder: 5,
            downOrigin: {x: 0, y: 0},
            minimumMoveDistance: 0,
            moving: false,
            tappedCell: {row: -1, column: -1},
            lastTapped: {row: -1, column: -1}
        }
    },
    methods: {
        // snap(){
        //     for(let i = 0; i < this.dragGroup.length; i++){

        //     }
        // },
        moveGroup (property, e, space) {
            // const group = getPiecesByProperty(this.pieces, direction, this.dragger[direction]);
            const groupSize = property == 'x' ? this.pattern[0].length : this.pattern.length;
            // console.log(groupSize);
            for(let i = 0; i < this.dragGroup.length; i++){
                this.dragGroup[i][property] = e[property] - this.offset[property] - this.dragOffsets[i][property];
                if(this.dragGroup[i][property] > this.startCenters[groupSize - 1][property]){
                    // this.dragGroup[i][property] -= space * this.structure.length;
                    this.dragOffsets[i][property] += space * groupSize;
                }
                if(this.dragGroup[i][property] < this.startCenters[0][property] - space){
                    // this.dragGroup[i][property] += space * this.structure.length;
                    this.dragOffsets[i][property] -= space * groupSize;
                }
            }
        },
        getGroupOffsets () {
            let offsets = [];
            for(let i = 0; i < this.dragGroup.length; i++){
                offsets.push({x: this.dragger.x - this.dragGroup[i].x, y: this.dragger.y - this.dragGroup[i].y});
            }
            return offsets;
        },
        getStartCenters (space) {
            let centers = [];
            for(let i = 0; i < this.dragGroup.length; i++){
                centers.push({x: this.dragGroup[i].x + (space / 2), y: this.dragGroup[i].y + (space / 2)});
            }
            return centers;
        },
        createBGSquare(index, space){
            return this.draw.rect({fill: this.colors[index], fillOpacity: 1, strokeWidth: 0, strokeOpacity: 0, stroke: 0xffffff, width: space, height: space, x: 0, y: 0})
        },
        updateGame(levelCheck){
            const pieceStatus = this.pieces.map(piece => piece.status);
            const gameState = reshape(pieceStatus, this.structure.length);
            const levelComplete = levelCheck && checkForWin(gameState, this.structure[0][0].split('-').length > 1);
            this.$emit('updated', {gameState, levelComplete, setup: !levelCheck});
        }
    },
    mounted () {
        this.instance = new PixiInstance(this.$refs.pixiTarget, this.boardSize.width, this.boardSize.height, true);
        let h = 0;
        let v = 0;
        let inset = this.boardSize.width * .006;
        const space = (this.boardSize.width - (this.boardBorder * 2)) / this.structure[0].length;
        this.originPoint.y = (this.boardSize.height / 2) - ((this.structure.length / 2) * space);
        this.highLighter = this.draw.rect({fill: 0x000000, fillOpacity: 0, strokeWidth: 2, strokeOpacity: 1, stroke: 0xcc0000, width: space, height: space, x: 0, y: 0});
        this.instance.getApp().stage.addChild(this.highLighter);
        this.highLighter.visible = false;
        for(let i = 0; i < this.structure.length; i++){
            h = 0;
            for(let j = 0; j < this.structure[i].length; j++){
                const sprite = this.utils.sprite();
                // const color = this.structure[i][j] == 1 ? 0x00cc00 : 0xcc0000;
                const full = this.utils.sprite();
                full.x = inset;
                full.y = inset;
                // const full = this.draw.rect({fill: 0x000000, fillOpacity: .06, strokeWidth: 2, strokeOpacity: 0, stroke: 0xffffff, width: space - (inset * 2), height: space - (inset * 2), x: inset, y: inset});
                sprite.addChild(full);
                const bgContainer = this.utils.sprite();
                bgContainer.addChild(this.createBGSquare(Number(this.structure[i][j].split('-')[0]), space));
                sprite.addChild(bgContainer);
                if(this.structure[i][j].split('-').length > 1){
                    const text = this.utils.text(this.structure[i][j].split('-')[1], {fontSize: space / 2});
                    text.x = space / 2;
                    text.y = space / 2;
                    text.anchor.set(0.5);
                    sprite.addChild(text);
                }
                
                full.visible = this.structure[i][j] != 0 && this.structure[i][j] != ' ';
                this.pieces.push(sprite);
                sprite.x = this.originPoint.x + (space*h);
                sprite.y = this.originPoint.y + (space*v);
                sprite.h = h;
                sprite.v = v;
                sprite.status = this.structure[i][j];
                this.instance.getApp().stage.addChild(sprite);
                this.action.down(sprite, (e) => {
                    this.dragger = sprite;
                    this.downOrigin = e;
                    this.offset = {x: e.x - sprite.x, y: e.y - sprite.y};
                    this.dragCycles = 0;
                    this.dragStart = e;
                    this.dragDirection = null;
                    this.moving = false;
                    this.minimumMoveDistance = space / 2;
                });
                this.action.move(sprite, (e) => {
                    const canMove = Math.abs(this.downOrigin.x - e.x) > this.minimumMoveDistance || Math.abs(this.downOrigin.y - e.y) > this.minimumMoveDistance;
                    if(this.dragger && (canMove || this.moving)){
                        this.moving = true;
                        this.dragCycles++;
                        
                        if(this.dragCycles > this.dragCycleMax && !this.dragDirection){
                            this.dragDirection = Math.abs(this.dragStart.x - e.x) > Math.abs(this.dragStart.y - e.y) ? 'v' : 'h';
                            this.dragGroup = getPiecesByProperty(this.pieces, this.dragDirection, this.dragger[this.dragDirection]);
                            this.dragOffsets = this.getGroupOffsets();
                            this.startCenters = this.getStartCenters(space);
                        }
                        else if(this.dragDirection == 'h'){
                            // this.dragger.x = e.x - this.offset.x;
                            this.moveGroup('y', e, space);
                        }
                        else if(this.dragDirection == 'v'){
                            // this.dragger.y = e.y - this.offset.y;
                            this.moveGroup('x', e, space);
                        }
                    }
                });
                this.action.up(sprite, () => {
                    // console.log(this.dragger);
                    this.dragger = null;
                    if(this.dragDirection){
                        const sortProp = this.dragDirection == 'h' ? 'y' : 'x';
                        let dragPragPropertyList = [];
                        for(let i = 0; i < this.dragGroup.length; i++){
                            dragPragPropertyList.push({x: this.dragGroup[i].x, y: this.dragGroup[i].y, status: this.dragGroup[i].status});
                        }
                        const sortedDragGroup = dragPragPropertyList.sort((a, b) => (a[sortProp] > b[sortProp]) ? 1 : -1);
                        for(let i = 0; i < this.dragGroup.length; i++){
                            this.dragGroup[i].status = sortedDragGroup[i].status;
                            console.log(this.dragGroup[i].status);
                            this.dragGroup[i].x = this.startCenters[i].x - (space / 2);
                            this.dragGroup[i].y = this.startCenters[i].y - (space / 2);
                            const full = this.dragGroup[i].children[1];
                            this.dragGroup[i].children[1].removeChild(this.dragGroup[i].children[1].children[0]);
                            this.dragGroup[i].children[1].addChild(this.createBGSquare(Number(this.dragGroup[i].status.split('-')[0]), space));
                            if(this.dragGroup[i].status.split('-').length > 1){
                                this.dragGroup[i].children[2].text = this.dragGroup[i].status.split('-')[1];
                            }
                            
                            full.visible = this.dragGroup[i].status == 1 || this.dragGroup[i].status != ' ';
                        }
                    }
                    this.updateGame(true);
                });
                h++;
            }
            v++;
        }
        this.updateGame();
        
    }
}
</script>

<style>

</style>