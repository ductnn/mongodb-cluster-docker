// Shard 1
sh.addShard(
    "rs-shard-01/shard01-a:27017",
    "rs-shard-01/shard01-b:27017",
    "rs-shard-01/shard01-c:27017",
)

// Shard 2
sh.addShard(
    "rs-shard-02/shard02-a:27017",
    "rs-shard-02/shard02-b:27017",
    "rs-shard-02/shard02-c:27017",
)

// Shard 3
sh.addShard(
    "rs-shard-03/shard03-a:27017",
    "rs-shard-03/shard03-b:27017",
    "rs-shard-03/shard03-c:27017",
)

// sh.addShard("rs-shard-01/shard01-a:27017")
// sh.addShard("rs-shard-01/shard01-b:27017")
// sh.addShard("rs-shard-01/shard01-c:27017")
// sh.addShard("rs-shard-02/shard02-a:27017")
// sh.addShard("rs-shard-02/shard02-b:27017")
// sh.addShard("rs-shard-02/shard02-c:27017")
// sh.addShard("rs-shard-03/shard03-a:27017")
// sh.addShard("rs-shard-03/shard03-b:27017")
// sh.addShard("rs-shard-03/shard03-c:27017")
