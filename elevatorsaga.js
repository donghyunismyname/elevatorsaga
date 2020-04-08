{
    init: function(elevators, floors) {
        function pickRandomInArray(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }
        function upElevator() {
            ret = pickRandomInArray(elevators.filter(e => e.goingUpIndicator()));
            return ret==undefined ? pickRandomInArray(elevators) : ret;
        }
        function downElevator() {
            ret = pickRandomInArray(elevators.filter(e => e.goingDownIndicator()));
            return ret==undefined ? pickRandomInArray(elevators) : ret;
        }
        function minLoadFactorElevator() {
            ret = elevators[0]
            for (elevator of elevators) {
                ret = ret.loadFactor() < elevator.loadFactor() ? ret : elevator;
            }
            return ret;
        }

        upWaitingFloors = []
        downWaitingFloors = []
        function arrange(elevator) {
            console.assert(elevator.destinationDirection() == "stopped");
            ct = new Date().getTime();


            U = elevator.getPressedFloors().filter(f => f > elevator.currentFloor());
            D = elevator.getPressedFloors().filter(f => f < elevator.currentFloor());
            if (elevator.loadFactor() < 0.6) {
                U = U.concat(upWaitingFloors.filter(f => f > elevator.currentFloor()));
                D = D.concat(downWaitingFloors.filter(f => f < elevator.currentFloor()));
            }
            u = Math.min(...U);
            d = Math.min(...D);

            goUp = elevator.currentFloor() == floor.length-1 ? false :
                   elevator.currentFloor() == 0              ? true :
                   U.length==0 ? false :
                   D.length==0 ? true :
                   Math.abs(elevator.currentFloor() - u) < Math.abs(elevator.currentFloor() - d);
            elevator.goingUpIndicator(goUp);
            elevator.goingDownIndicator(!goUp);

            if (U.length==0 && D.length==0) return;

            dest = goUp ? u : d;
            elevator.goToFloor(dest);
            console.log(dest);

            if (elevator.loadFactor() < 0.6) {
                if (goUp)
                    upWaitingFloors = upWaitingFloors.filter(f => f != dest);
                else
                    downWaitingFloors = downWaitingFloors.filter(f => f != dest);
            }
        }

        for (elevator of elevators) {
            elevator.goingDownIndicator(false);
            elevator.on("stopped_at_floor", function(floorNum) {
                arrange(this);
            });
        }

        for (floor of floors) {
            floor.on("up_button_pressed", function() {
                upWaitingFloors.push([this.floorNum(), new Date().getTime()]);
                for (elevator of elevators)
                    if (elevator.destinationDirection() == "stopped")
                        arrange(elevator);
            });
            floor.on("down_button_pressed", function() {
                downWaitingFloors.push([this.floorNum(), new Date().getTime()]);
                for (elevator of elevators)
                    if (elevator.destinationDirection() == "stopped")
                        arrange(elevator);
            });
        }
    },


    update: function(dt, elevators, floors) {}
}
