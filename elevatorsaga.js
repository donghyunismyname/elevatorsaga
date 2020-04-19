{
    control: {
        elevators: undefined,
        floors: undefined,
        pickRandomInArray: function(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        },
        upElevator: function() {
            ret = pickRandomInArray(elevators.filter(e => e.goingUpIndicator()));
            return ret==undefined ? pickRandomInArray(elevators) : ret;
        },
        downElevator: function() {
            ret = pickRandomInArray(elevators.filter(e => e.goingDownIndicator()));
            return ret==undefined ? pickRandomInArray(elevators) : ret;
        },
        minLoadFactorElevator: function() {
            ret = elevators[0]
            for (elevator of elevators) {
                ret = ret.loadFactor() < elevator.loadFactor() ? ret : elevator;
            }
            return ret;
        },

        upWaitingFloors: [],
        downWaitingFloors: [],
        arrange: function(elevator) {
            console.assert(elevator.destinationDirection() == "stopped");
            //ct = new Date().getTime();

            U = elevator.getPressedFloors().filter(f => f > elevator.currentFloor());
            D = elevator.getPressedFloors().filter(f => f < elevator.currentFloor());
            if (elevator.loadFactor() < 0.7) {
                U = U.concat(this.upWaitingFloors.map(f => f.floorNum).filter(f => f > elevator.currentFloor()));
                D = D.concat(this.downWaitingFloors.map(f => f.floorNum).filter(f => f < elevator.currentFloor()));
            }
            u = Math.min(...U);
            d = Math.max(...D);
            console.log('u d', u, d);

            goUp = elevator.currentFloor() == this.floors.length-1 ? false :
                   elevator.currentFloor() == 0                    ? true :
                   U.length==0 ? false :
                   D.length==0 ? true :
                   Math.abs(elevator.currentFloor() - u) < Math.abs(elevator.currentFloor() - d);
            elevator.goingUpIndicator(goUp);
            elevator.goingDownIndicator(!goUp);

            if (U.length==0 && D.length==0) return;
            dest = goUp ? u : d;
            console.assert(0 <= dest && dest < this.floors.length);
            console.assert(dest != elevator.currentFloor())

            elevator.goToFloor(dest);
            console.log('[debug] goToFloor', dest);

            if (goUp)
                this.upWaitingFloors = this.upWaitingFloors.filter(f => f.floorNum != elevator.currentFloor());
            else
                this.downWaitingFloors = this.downWaitingFloors.filter(f => f.floorNum != elevator.currentFloor());


/*
            if (elevator.loadFactor() < 0.6) {
                if (goUp)
                    this.upWaitingFloors = this.upWaitingFloors.filter(f => f.floorNum != dest);
                else
                    this.downWaitingFloors = this.downWaitingFloors.filter(f => f.floorNum != dest);
            }*/
        },
    },

    init: function(elevators, floors) {
        console.log('========init==================')

        control = this.control
        control.elevators = elevators
        control.floors = floors

        for (elevator of elevators) {
            elevator.goingDownIndicator(false);
            elevator.on("stopped_at_floor", function(floorNum) {
                control.arrange(this);
            });
            elevator.on("idle", function() {
                control.arrange(this);
            });
        }

        for (floor of floors) {
            floor.on("up_button_pressed", function() {
                waitInfo = {floorNum:this.floorNum(), timestamp:new Date().getTime()}
                control.upWaitingFloors.push(waitInfo);
                for (elevator of elevators)
                    if (elevator.destinationDirection() == "stopped")
                        control.arrange(elevator)
            });
            floor.on("down_button_pressed", function() {
                waitInfo = {floorNum:this.floorNum(), timestamp:new Date().getTime()}
                control.downWaitingFloors.push(waitInfo);
                for (elevator of elevators)
                    if (elevator.destinationDirection() == "stopped")
                        control.arrange(elevator)
            });
        }
    },

    acc: 0,
    update: function(dt, elevators, floors) {
        this.acc += dt
        if (this.acc < 0.2) return;
        this.acc -= 0.2

        console.log('[debug] upWaitingFloors', this.control.upWaitingFloors)
        console.log('[debug] downWaitingFloors', this.control.downWaitingFloors)
        for (elevator of elevators) {
            console.log('[debug] currentFloor', elevator.currentFloor())
            console.log('[debug] direction', elevator.destinationDirection())
            //console.log('[debug] queue', elevator.destinationQueue)
            if (elevator.destinationDirection() == "stopped") {

                this.control.arrange(elevator);
            }
        }
    },
}
