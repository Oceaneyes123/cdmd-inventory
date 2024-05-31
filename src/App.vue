<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <h2 class="mt-2">{{ name }} Inventory</h2>
          <v-spacer></v-spacer>
          <v-alert :text="alertText" :type="alertType" v-if="showAlert"/>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-tabs v-model="tab">
                <v-tab :value="1">Dashboard</v-tab>
                <v-tab :value="2">Sales</v-tab>
                <v-tab :value="3">Stock</v-tab>
              </v-tabs>
              <v-tabs-window v-model="tab">
                <v-tabs-window-item
                  :value="3"
                >
                  <v-container fluid>
                    <v-row>
                      <v-col>
                        <div class="mb-2 font-weight-bold text-h6">{{ isEdit ? 'EDIT' : 'ADD' }} PRODUCT</div>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="5">
                        <v-text-field v-model="newProduct.name" placeholder="Name" label="Name" />
                      </v-col>
                      <v-col cols="2">
                        <v-text-field v-model="newProduct.costPrice" type="number" placeholder="Cost" label="Cost Price"/>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field v-model="newProduct.retailPrice" type="number" placeholder="Retail" label="Retail Price"/>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field v-model="newProduct.stock" type="number" placeholder="Stock" label="Stock"/>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="5">
                        <v-select v-model="newProduct.category" :items="categories" label="Category"></v-select>
                      </v-col>
                      <v-col cols="4">
                        <v-btn v-if="isEdit" block @click="editProduct()" color="primary" size="large">Edit Product</v-btn>
                        <v-btn v-else block @click="addProduct()" color="primary" size="large">Add Product</v-btn>
                      </v-col>
                      <v-col cols="2" v-if="isEdit">
                        <v-btn color="warning" @click="isEdit = false" size="large">Cancel Edit</v-btn>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <div class="mb-4 text-h4 font-weight-bold">ITEMS</div>
                        <div>
                          <v-container>
                            <v-row class="justify-end">
                              <v-col cols="4 d-flex justify-end">
                                <v-btn color="warning" class="mr-4" @click="isEdit = true, clickEdit()" :disabled="selectedProducts.length == 1 ? false : true">Edit</v-btn>
                                <v-btn color="error" @click="deleteProducts()">Delete</v-btn>
                              </v-col>
                            </v-row>
                          </v-container>
                        </div>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-card
                          flat
                        >
                        <template v-slot:text>
                          <v-text-field
                            v-model="search"
                            label="Search"
                            prepend-inner-icon="mdi-magnify"
                            variant="outlined"
                            hide-details
                            single-line
                          ></v-text-field>
                        </template>

                        <v-data-table
                           v-model="selectedProducts"
                          :headers="headers"
                          :items="products"
                          :search="search"
                          item-value="name"
                          return-object
                          show-select
                        >
                      </v-data-table>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-container>
                  </v-tabs-window-item>
              </v-tabs-window>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script>
  import axios from 'axios';
  export default {
    data(){
      return{
        name: 'CDMD Pharmacy',
        apiURL: 'http://localhost:3001',
        tab: 3,
        selectedProducts: [],
        products: [],
        search: '',
        
        isEdit: false,

        showAlert: false,
        alertText: '',
        alertType: '',
        
        newProduct: {},
        categories: [
          "SYRUP",
          "ANTIHYPERTENSIVES",
          "ANTIDIABETICS",
          "GASTRO/ BM",
          "VITAMINS & MINERALS",
          "PAIN RELIEVERS",
          "ANTIASTHMA/ ANTIALLERGIES/ COUGH AND COLD MEDS",
          "ANTIHYPERTENSIVE 2",
          "ANTIBIOTICS",
          "CNS/ANTI-VERTIGO/ ANTI-EPILIPTICS",
          "MARIDAN PRODUCTS",
          "FOOD SUPP./LINIMENTS/ OTHER OTC",
          "TOPICAL CREAM AND OINTMENTS" ,
          "OTHERS"
        ],

        headers: [
          { title: 'Name', key: 'name' },
          { title: 'Category', key: 'category' },
          { title: 'Cost Price', key: 'cost_price' },
          { title: 'Retail Price', key: 'retail_price' },
          { title: 'Stock', key: 'stock' },
        ]
      }
    },

    mounted(){
      this.getAllProducts();
    },

    watch: {
      
    },

    methods: {
      getAllProducts(){
        //get all products from the database using axios
        axios.get(this.apiURL + '/products')
        .then(res => {
           this.products = res.data;
           console.log(this.products);
         });
      },

      addProduct(){
        //add the product to the database using axios
        //convert costPrice and retailPrice into float of 2 decimal places
        axios.post(this.apiURL + '/products', this.newProduct)
        .then(res => {
           this.alertText = res.data.message;
           this.alertType = res.data.type;
           this.showAlert = true;
           setTimeout(() => {
             this.showAlert = false;
           }, 2000);
           this.newProduct = {};
           this.getAllProducts();
        });
      },

      clickEdit(){
        let {name, category, cost_price, retail_price, stock, product_id} = this.selectedProducts[0];
        this.newProduct = {name, category, costPrice: cost_price, retailPrice: retail_price, stock, product_id};
      },

      editProduct(){
        axios.put(this.apiURL + '/products/' + this.newProduct.product_id, this.newProduct)
        .then(res => {
          console.log(res)
           this.alertText = res.data.message;
           this.alertType = res.data.type;
           this.showAlert = true;
           setTimeout(() => {
             this.showAlert = false;
           }, 2000);
           this.newProduct = {};
           this.selectedProducts = [];
           this.getAllProducts();
        });
      },

      deleteProducts(){

        let deleteIDArray = [];
        for(let i = 0; i < this.selectedProducts.length; i++){
          deleteIDArray.push(this.selectedProducts[i].product_id);
        }
        //send selected products to the database using axios
        axios.post(this.apiURL + '/deleteProducts', deleteIDArray).then(res => {
          this.alertText = res.data.message;
          this.alertType = res.data.type;
          this.showAlert = true;
          setTimeout(() => {
            this.showAlert = false;
          }, 2000);
          this.selectedProducts = [];
          this.getAllProducts();
        });
      }
  }
}
</script>
