{
    init: function(elevators, floors) {
        console.log('========init==================')

        upWaitingFloors = []
        downWaitingFloors = []
        go = function(e, dir) {
            e.destinationQueue = [];
            e.checkDestinationQueue();

            F = e.getPressedFloors().concat(upWaitingFloors).concat(downWaitingFloors);
            u = Math.max(...F);
            d = Math.min(...F);

            if (dir == 1 && e.currentFloor() < u && u != Infinity) {
                e.goingUpIndicator(true);
                e.goingDownIndicator(false);
                e.goToFloor(u);
                if (e.destinationDirection() == "stopped")
                    upWaitingFloors = upWaitingFloors.filter(f => f != e.currentFloor());
                return true;
            }
            else if (dir == -1 && e.currentFloor() > d && d != -Infinity) {
                e.goingUpIndicator(false);
                e.goingDownIndicator(true);
                e.goToFloor(d);
                if (e.destinationDirection() == "stopped")
                    downWaitingFloors = downWaitingFloors.filter(f => f != e.currentFloor());
                return true;
            }

            e.goingUpIndicator(true);
            e.goingDownIndicator(true);
            return false;
        }
        work = function(e) {
            if (e.goingUpIndicator())
                go(e, 1) || go(e, -1);
            else if (e.goingDownIndicator())
                go(e, -1) || go(e, 1);
            else
                console.assert(false);
        }

        for (elevator of elevators) {
            //elevator.work = work
            elevator.on("stopped_at_floor", function(floorNum) {
                console.log(upWaitingFloors, downWaitingFloors);
                work(this);
            });
            elevator.on("floor_button_pressed", function(floorNum) {
                work(this);
            });

            elevator.on("passing_floor", function(floorNum, direction) {
                stopHere = this.getPressedFloors().includes(floorNum) || this.loadFactor() < 0.5 &&
                           (this.goingUpIndicator() ? upWaitingFloors : downWaitingFloors).includes(floorNum);
                if (stopHere)
                    this.goToFloor(floorNum, true);
            });
        }

        for (floor of floors) {
            floor.on("up_button_pressed", function() {
                upWaitingFloors.push(this.floorNum());
                for (e of elevators) if (e.destinationDirection()=="stopped" && e.loadFactor()==0) {
                    work(e);
                    break;
                }
            });
            floor.on("down_button_pressed", function() {
                downWaitingFloors.push(this.floorNum());
                for (e of elevators) if (e.destinationDirection()=="stopped" && e.loadFactor()==0) {
                    work(e);
                    break;
                }
            });
        }
    },

    acc: 0,
    update: function(dt, elevators, floors) {
        this.acc += dt
        if (this.acc < 2) return;
        this.acc -= 2;
    },
}
