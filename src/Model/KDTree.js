import { isValidElement } from 'react';
import { v4 as uuid } from 'uuid';

function euclidean(dest_x, curr_x, dest_y, curr_y) {
    return Math.sqrt((dest_x - curr_x) ** 2 + (dest_y - curr_y) ** 2);
}

export class Dot {
    constructor(position) {
        this.position = position;
    }

    setIsVertical(isVertical) { this.isVertical = isVertical; }

    getPosition() { return this.position; }

    getIsVertical() {
        if (this.isVertical) { return this.isVertical; }
    }
}

export class Line {
    constructor(position, x_bound, y_bound, isVertical) {
        this.position = position;
        this.x_bound = x_bound;
        this.y_bound = y_bound;
        this.isVertical = isVertical;
    }

    getPosition() { return this.position; }

    getIsVertical() { return this.isVertical }

    getXBound() { return this.x_bound; }

    getYBound() { return this.y_bound; }
}

export default class KDTree {
    constructor(dots, initial_x_bound, initial_y_bound) {
        this.dots = dots;
        this.root_dot = dots[Math.floor(dots.length / 2)];
        this.root = new TreeNode(true, this.root_dot, initial_x_bound, initial_y_bound);
        this.root.sortCoordinates(dots, true);
        this.root.constructTree(dots);
    }

    getRoot() { return this.root; }

    iterateTree() {
        /** return the tree iteration with BFS order */
        const root = this.getRoot();
        var result = [];
        if (root) { root.iterate(result); }
        return result;
    }

    getNodeTraversedAfterInsertion(position) {
        /** The dot at 'position' is also included in the result, as a fake new dot */
        const root = this.getRoot();
        var result = [];
        if (root) { root.getNodeTraversedAfterInsertion(result, position); }
        return result;
    }

    performNearestSearching(position) {
        /** 
         * This function searches the nearest tree node around 'position', 
         * and returns:
         *      1. the nearest neighbor
         *      2. all nodes that are traversed during searching for animation purpose, excluding those traversed during insertion
         * */
        const dest_x = position.x;
        const dest_y = position.y;
        var stack = this.getNodeTraversedAfterInsertion(position);
        stack.pop(); // pop the fake dot that is not part of the actual tree
        var curr_node = stack[stack.length - 1];
        var curr_x = curr_node.getPosition().x;
        var curr_y = curr_node.getPosition().y;
        var best_distance = euclidean(dest_x, curr_x, dest_y, curr_y);
        var nearest_neighbor = curr_node;
        var visited = new Set();

        var bound_animation = []; // for displaying bound change
        var crossing_animation = []; // for displaying circle drawing
        while(stack.length != 0) {
            curr_node = stack.pop();
            visited.add(curr_node.getID());
            // console.log(curr_node, visited);
            curr_x = curr_node.getPosition().x;
            curr_y = curr_node.getPosition().y;
            if (euclidean(dest_x, curr_x, dest_y, curr_y) <= best_distance) {
                best_distance = euclidean(dest_x, curr_x, dest_y, curr_y);
                nearest_neighbor = curr_node;
            }
            if (curr_node.right && !visited.has(curr_node.right.getID())) {
                if (curr_node.intersectDownOrRight(dest_x, dest_y, best_distance)) {
                    stack.push(curr_node.right);
                    bound_animation.push(curr_node);
                } else {
                    bound_animation.push(null);
                }
                var direction = curr_node.isVertical ? 'right' : 'down';
                crossing_animation.push({
                    length: best_distance,
                    direction: direction
                });
            }
            if (curr_node.left && !visited.has(curr_node.left.getID())) {
                if (curr_node.intersectUpOrLeft(dest_x, dest_y, best_distance)) {
                    stack.push(curr_node.left);
                    bound_animation.push(curr_node);
                } else {
                    bound_animation.push(null);
                }
                var direction = curr_node.isVertical ? 'left' : 'up';
                crossing_animation.push({
                    length: best_distance,
                    direction: direction
                });
            }

        }
        return {
            nearest: nearest_neighbor,
            bound_animation: bound_animation,
            crossing_animation: crossing_animation
        }
    }
}

export class TreeNode {
    constructor(isVertical, dot, x_bound, y_bound) {
        /**
         * dots: array, a list of dot of all points (markers) on the screen
         * isVertical: boolean, whether or not current node is vertically cutting the hyperplane => sorted by x: true; sorted by y: false
         * Dot: instance of the dot, position on the screen that the node correspond to
         * bound: {min, max}, line drawing purposes
         */
        this.isVertical = isVertical;
        this.dot = dot;
        this.dot.setIsVertical(isVertical);
        this.x_bound = x_bound;
        this.y_bound = y_bound;
        this.line = new Line(dot.getPosition(), x_bound, y_bound, isVertical);
        this.id = uuid();
    }

    getID() { return this.id; }

    getLine() { return this.line; }

    getPosition() { return this.getDot().getPosition(); }

    getDot() { return this.dot; }

    getIsVertical() { return this.isVertical }

    getXBound() { return this.x_bound; }

    getYBound() { return this.y_bound; }

    sortCoordinates(dots, isSortingByX) {
        /* isSortingByX: boolean */
        if (isSortingByX) {
            dots.sort((dot1, dot2) => {
                const x1 = dot1.getPosition().x;
                const x2 = dot2.getPosition().x;
                if (x1 < x2) { return -1; }
                if (x1 > x2) { return 1; }
                return 0;
            })
        } else {
            dots.sort((dot1, dot2) => {
                const y1 = dot1.getPosition().y;
                const y2 = dot2.getPosition().y;
                if (y1 < y2) { return -1; }
                if (y1 > y2) { return 1; }
                return 0;
            })
        }
    }

    constructTree(dots) {
        /** dots are sorted according to this.isVertical */
        if (dots.length <= 1) { return; }
        var leftHalf = dots.slice(0, Math.floor(dots.length / 2));
        var rightHalf = dots.slice(Math.floor(dots.length / 2) + 1, dots.length);
        this.sortCoordinates(leftHalf, !this.isVertical);
        this.sortCoordinates(rightHalf, !this.isVertical);
        if (leftHalf.length != 0) {
            const left_dot = leftHalf[Math.floor(leftHalf.length / 2)];
            var left_x_bound, left_y_bound;
            if (this.isVertical) {
                left_x_bound = { min: this.x_bound.min, max: this.dot.position.x };
                left_y_bound = this.y_bound;
            } else {
                left_x_bound = this.x_bound;
                left_y_bound = { min: this.y_bound.min, max: this.dot.position.y };
            }
            this.left = new TreeNode(!this.isVertical, left_dot, left_x_bound, left_y_bound);
            this.left.constructTree(leftHalf);
        }
        if (rightHalf.length != 0) {
            const right_dot = rightHalf[Math.floor(rightHalf.length / 2)];
            var right_x_bound, right_y_bound;
            if (this.isVertical) {
                right_x_bound = { min: this.dot.position.x, max: this.x_bound.max };
                right_y_bound = this.y_bound;
            } else {
                right_x_bound = this.x_bound;
                right_y_bound = { min: this.dot.position.y, max: this.y_bound.max };
            }
            this.right = new TreeNode(!this.isVertical, right_dot, right_x_bound, right_y_bound);
            this.right.constructTree(rightHalf);
        }
    }

    iterate(lst) {
        /** add all tree node element to the list in BFS order*/
        lst.push(this);
        if (this.left) { this.left.iterate(lst); }
        if (this.right) { this.right.iterate(lst); }
    }

    getNodeTraversedAfterInsertion(stack, position) {
        const dest_x = position.x;
        const dest_y = position.y;
        const curr_x = this.getDot().getPosition().x;
        const curr_y = this.getDot().getPosition().y;
        stack.push(this);
        if (this.isVertical) { // comparing x
            if (dest_x < curr_x) {
                if (!this.left) {
                    stack.push(this.getInsertedDestinationNode(position, curr_x, curr_y));
                    return stack;
                }
                return this.left.getNodeTraversedAfterInsertion(stack, position);
            }
            else {
                if (!this.right) {
                    stack.push(this.getInsertedDestinationNode(position, curr_x, curr_y));
                    return stack;
                }
                return this.right.getNodeTraversedAfterInsertion(stack, position);
            }
        } else { // comparing y
            if (dest_y < curr_y) {
                if (!this.left) {
                    stack.push(this.getInsertedDestinationNode(position, curr_x, curr_y));
                    return stack;
                }
                return this.left.getNodeTraversedAfterInsertion(stack, position);
            }
            else {
                if (!this.right) {
                    stack.push(this.getInsertedDestinationNode(position, curr_x, curr_y));
                    return stack;
                }
                return this.right.getNodeTraversedAfterInsertion(stack, position);
            }
        }
    }

    getInsertedDestinationNode(position, curr_x, curr_y) {
        /** In order to get the correct bound display, the dot at 'position' need to be added as a fake dot */
        const dest_x = position.x;
        const dest_y = position.y;
        var inserted_x_bound;
        var inserted_y_bound;
        if (this.isVertical) { // comparing x
            inserted_y_bound = this.y_bound;
            if (dest_x < curr_x) {
                inserted_x_bound = { min: this.x_bound.min, max: this.dot.position.x };
            }
            else {
                inserted_x_bound = { min: this.dot.position.x, max: this.x_bound.max };
            }
        } else { // comparing y
            inserted_x_bound = this.x_bound;
            if (dest_y < curr_y) {
                inserted_y_bound = { min: this.y_bound.min, max: this.dot.position.y };
            }
            else {
                inserted_y_bound = { min: this.dot.position.y, max: this.y_bound.max };
            }
        }
        const inserted_dot = new Dot(position);
        return new TreeNode(!this.isVertical, inserted_dot, inserted_x_bound, inserted_y_bound);
    }

    getNodesTraversedAfterClosestSearching(stack, position) {
        /** 
         * stack: array of TreeNodes 
         * */
        const dest_x = position.x;
        const dest_y = position.y;
        const curr_x = stack[stack.length - 1].getPosition().x;
        const curr_y = stack[stack.length - 1].getPosition().y;
        var best_distance = euclidean(dest_x, curr_x, dest_y, curr_y);
    }

    intersectUpOrLeft(dest_x, dest_y, best_distance) {
        /** return true if any up or left hyperplane is intersected */
        // left
        if (this.isVertical) { return dest_x - best_distance <= this.getPosition().x; }
        // up
        else { return dest_y - best_distance <= this.getPosition().y } 
    }

    intersectDownOrRight(dest_x, dest_y, best_distance) {
        /** return true if any down or right hyperplane is intersected */
        // right
        if (this.isVertical) { return dest_x + best_distance >= this.getPosition().x; }
        // down
        else { return dest_y + best_distance >= this.getPosition().y } 
    }
}