{
    init: function(elevators, floors) {
        for (elevator of elevators) {
            elevator.on("idle", function() {
                for (i=floors.length-1; i>=0; i--)
                    this.goToFloor(i);
            });

            elevator.on("passing_floor", function(floorNum, direction) {
                console.log("passing_floor");
            });

            elevator.on("stopped_at_floor", function(floorNum) {
                console.log("stopped_at_floor");
            });
        }
    },
        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
        }
}
