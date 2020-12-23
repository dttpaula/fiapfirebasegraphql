const admin = require('firebase-admin');

module.exports = {
    Query:{
        produto:()=>{
            // return [{
            //     id:1,
            //     nomeproduto:"String",
            //     descricao:"String",
            //     fornecedor:"String",
            //     preco:10.0,
            //     datacadastro:"String"          
            // }]
            return admin.database()
                   .ref("produtos")
                   .once("value")
                   .then(snap => snap.val())
                   .then(val => Object.keys(val)
                   .map((key)=>val[key]))
        }
    },
    Mutation:{
        novoProduto(_,{id,nomeproduto,descricao,fornecedor,preco,datacadastro}) {
            const novo = {
                id:id,
                nomeproduto:nomeproduto,
                descricao:descricao,
                fornecedor:fornecedor,
                preco:preco,
                datacadastro:datacadastro
            }
            
            let find = false
            let db = admin.database()
            return db.ref("produtos/" + id)
              .once("value", snapshot => {
                  if (snapshot.exists()){
                      find = true
                      console.log("Exist")
                  } else {
                      console.log("Not exist")
                  }
              }).then(()=>{
                  if (!find) {
                    db.ref("produtos/" + id)
                         .update(novo);
                    console.log("Updated")
                    return db.ref("produtos")
                        .limitToLast(1)
                        .once("value")
                        .then(snap => snap.val())
                        .then(val => Object.keys(val)
                        .map((key)=>val[key]))
                  } else {
                    console.log("Not Updated")
                  }
              })
        },
        removeProduto(_,{id}){
            console.log("produtos/" + id)
            admin.database()
            .ref("produtos/" + id)
            .remove()
            .then(function() {
                console.log("Remove succeeded.")
              })
            .catch(function(error) {
                console.log("Remove failed: " + error.message)
              });
        },
        updateProduto(_,{id,nomeproduto,descricao,fornecedor,preco,datacadastro}) {
            let find = false
            let db = admin.database()
            return db.ref("produtos/" + id)
              .once("value", snapshot => {
                  if (snapshot.exists()){
                      find = true
                      console.log("Exist")
                  } else {
                      console.log("Not exist")
                  }
              }).then(()=>{
                  if (find) {
                    console.log("Updated")
                    db
                    .ref("produtos/" + id).update(
                        {
                            'nomeproduto': nomeproduto,
                            'descricao': descricao,
                            'fornecedor': fornecedor,
                            'preco': preco,
                            'datacadastro': datacadastro
                    })
                    return db.ref("produtos/" + id).once("value").then(result=>result.toJSON())
                  } else {
                    console.log("Not Updated")
                  }
              })
            return "OK"
        }
    
    }
}

// mutation{
//     removeProduto(
//       id:2
//     ) 
//   }

// mutation{
//     novoProduto(
//       id:2
//       nomeproduto:"asasasa"
//       descricao:"wwww"
//       fornecedor:"wwww"
//       preco:4555
//       datacadastro:"12/12/1245"
//     ) 
//   }


// mutation{
//     updateProduto(
//       id:2
//       nomeproduto:"asasasa"
//       descricao:"wwww"
//       fornecedor:"wwww"
//       preco:4555
//       datacadastro:"12/12/1245"
//     ) 
//   }