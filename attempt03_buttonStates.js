{
    init: function(elevators, floors) {
        console.log('========init==================')

        go = function(e, dir) {
            e.destinationQueue = [];
            e.checkDestinationQueue();

            buttonedFloors = floors
            .filter(f => f.buttonStates["up"]=="activated" || f.buttonStates["down"]=="activated")
            .map(f => f.floorNum());

            reservedFloors = elevators
            .filter(e => e.destinationQueue.length > 0)
            .map(e => e.destinationQueue[0]);

            F = buttonedFloors
            .filter(f => !reservedFloors.includes(f))
            .concat(e.getPressedFloors());
            u = Math.max(...F);
            d = Math.min(...F);

            if (dir == 1 && e.currentFloor() < u && u != Infinity) {
                e.goingUpIndicator(true);
                e.goingDownIndicator(false);
                e.goToFloor(u);
                return true;
            }
            else if (dir == -1 && e.currentFloor() > d && d != -Infinity) {
                e.goingUpIndicator(false);
                e.goingDownIndicator(true);
                e.goToFloor(d);
                return true;
            }

            return false;
        }
        work = function(e) {
            if (e.goingUpIndicator())
                go(e, 1) || go(e, -1) || e.goingUpIndicator(true), e.goingDownIndicator(true);
            else if (e.goingDownIndicator())
                go(e, -1) || go(e, 1) || e.goingUpIndicator(true), e.goingDownIndicator(true);
            else
                console.assert(false);
        }

        for (elevator of elevators) {
            //elevator.work = work
            elevator.on("stopped_at_floor", function(floorNum) {
                work(this);
            });
            elevator.on("floor_button_pressed", function(floorNum) {
                work(this);
            });

            elevator.on("passing_floor", function(floorNum, direction) {
                stopHere = this.getPressedFloors().includes(floorNum) ||
                this.loadFactor() < 0.7 && floors
                .filter(
                    f => f.buttonStates[this.goingUpIndicator() ? "up" : "down"]=="activated")
                    .map(f => f.floorNum())
                    .includes(floorNum);

                if (stopHere)
                    this.goToFloor(floorNum, true);
            });
        }

        for (floor of floors) {
            floor.on("up_button_pressed", function() {
                for (e of elevators) if (e.destinationDirection()=="stopped" && e.loadFactor()==0) {
                    work(e);
                }
            });
            floor.on("down_button_pressed", function() {
                for (e of elevators) if (e.destinationDirection()=="stopped" && e.loadFactor()==0) {
                    work(e);
                }
            });
        }
    },


    acc: 0,
    update: function(dt, elevators, floors) {
        this.acc += dt
        if (this.acc < 1) return;
        this.acc -= 1;

        //for (f of floors) console.log(f.buttonStates)
    },
}
