{
    init: function(elevators, floors) {
        console.log('========init==================')

        upWaitingFloors = []
        downWaitingFloors = []
        keepGoing = function(e) {
            e.destinationQueue = [];
            e.checkDestinationQueue();

            F = e.getPressedFloors().concat(upWaitingFloors).concat(downWaitingFloors);
            u = Math.max(...F);
            d = Math.min(...F);

            if (e.goingUpIndicator() && e.currentFloor() < u && u != Infinity) {
                console.assert(e.goingDownIndicator() == false);
                upWaitingFloors = upWaitingFloors.filter(f => f != e.currentFloor());
                e.goToFloor(u);
                return;
            }
            else if (e.goingDownIndicator() && e.currentFloor() > d && d != -Infinity) {
                console.assert(e.goingUpIndicator() == false);
                downWaitingFloors = downWaitingFloors.filter(f => f != e.currentFloor());
                e.goToFloor(d);
                return;
            }
        }

        for (elevator of elevators) {
            elevator.goingDownIndicator(false);
            elevator.keepGoing = keepGoing

            elevator.on("stopped_at_floor", function(floorNum) {
                keepGoing(this);
            });
            elevator.on("floor_button_pressed", function(floorNum) {
                keepGoing(this);
            });

            elevator.on("passing_floor", function(floorNum, direction) {
                stopHere = this.getPressedFloors().includes(floorNum) ||
                           (this.goingUpIndicator() ? upWaitingFloors : downWaitingFloors).includes(floorNum);
                if (stopHere)
                    this.goToFloor(floorNum, true);
            });
        }

        for (floor of floors) {
            floor.on("up_button_pressed", function() {
                upWaitingFloors.push(this.floorNum());
            });
            floor.on("down_button_pressed", function() {
                downWaitingFloors.push(this.floorNum());
            });
        }
    },

    acc: 0,
    update: function(dt, elevators, floors) {
        this.acc += dt
        if (this.acc < 2) return;
        this.acc -= 2;

        for (e of elevators) {
            if (e.destinationDirection() == "stopped") {
                goUp = e.goingUpIndicator();
                e.goingUpIndicator(!goUp);
                e.goingDownIndicator(goUp);
                e.keepGoing(e);
            }
        }
    },
}
