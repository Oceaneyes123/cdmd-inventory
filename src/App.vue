<template>
  <v-app>
    <v-main>
      <v-container class="position-relative">
        <v-row>
          <h2 class="mt-2">{{ name }} Inventory</h2>
          <v-spacer></v-spacer>
          <v-alert class="position-fixed" style="z-index:10;top:20px;right:20px" :text="alertText" :type="alertType" v-if="showAlert"/>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-tabs v-model="tab">
                <v-tab :value="1">Dashboard</v-tab>
                <v-tab :value="2">Stock</v-tab>
                <v-tab :value="3">Sales</v-tab>
              </v-tabs>
              <v-tabs-window v-model="tab">
                <v-tabs-window-item
                  :value="1"
                >
                <v-container>
                  <!-- <div>
                    <input type="file" id="input" />
                  </div> -->
                  <v-row>
                    <v-col cols="4">
                      <v-date-picker
                        v-model="selectedDate"
                        color="primary"
                      ></v-date-picker>
                    </v-col>
                    <v-col cols="8">
                      <v-container>
                        <v-row>
                          <v-col cols="12">
                            <v-container fluid>
                              <v-row>
                                <v-col cols="4">
                                  <v-card color="blue-darken-3" class="px-4 py-4 d-flex flex-column" height="100%">
                                    <div class="text-h6 font-weight-black mb-5">Monthly Gross Sale</div>
                                    <div class="text-h4 font-weight-black mb-5 mt-auto">₱{{ summary.monthGross ?  summary.monthGross : 0}}</div>
                                  </v-card>
                                </v-col>
                                <v-col cols="4">
                                  <v-card color="green-darken-3" class="px-4 py-4 d-flex flex-column" height="100%">
                                    <div class="text-h6 font-weight-black mb-5">Monthly Net Sale</div>
                                    <div class="text-h4 font-weight-black mb-5 mt-auto">₱{{ summary.monthNet ?  summary.monthNet : 0}}</div>
                                  </v-card>
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="4" align-self="end">
                                  <v-card color="purple-darken-3" class="px-4 py-4 d-flex flex-column" height="100%">
                                    <div class="text-h6 font-weight-black mb-5">Total Number of Products</div>
                                    <div class="text-h4 font-weight-black mb-5 mt-auto">{{ products.length }}</div>
                                  </v-card>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <v-container fluid>
                              <v-row>
                                <v-col cols="4">
                                  <v-card color="light-blue-darken-2" class="px-4 py-4 d-flex flex-column" height="100%">
                                    <div class="text-h6 font-weight-black mb-5">Daily Gross Sale</div>
                                    <div class="text-h4 font-weight-black mb-5 mt-auto">₱{{ summary.dailyGross ?  summary.dailyGross : 0}}</div>
                                  </v-card>
                                </v-col>
                                <v-col cols="4">
                                  <v-card color="teal-darken-2" class="px-4 py-4 d-flex flex-column" height="100%">
                                    <div class="text-h6 font-weight-black mb-5">Daily Net Sale</div>
                                    <div class="text-h4 font-weight-black mb-5 mt-auto">₱{{ summary.dailyNet ?  summary.dailyNet : 0}}</div>
                                  </v-card>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-col>
                  </v-row>
                  
                  <v-row>
                    <v-col>
                      
                    </v-col>
                  </v-row>
                </v-container>
              </v-tabs-window-item>
                <v-tabs-window-item
                  :value="2"
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
                        <v-btn color="warning" @click="isEdit = false, newProduct = {}" size="large">Cancel Edit</v-btn>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <div class="mb-4 text-h4 font-weight-bold">ITEMS</div>
                        <div>
                          <v-container>
                            <v-row class="justify-end">
                              <v-col cols="4 d-flex justify-end">
                                <v-btn color="primary" class="mr-4" @click="openSaleDialog()" :disabled="selectedProducts.length == 1 ? false : true">New Sales</v-btn>
                                <v-btn color="warning" class="mr-4" @click="isEdit = true, clickEdit()" :disabled="selectedProducts.length == 1 ? false : true">Edit</v-btn>
                                <v-btn color="error"  @click="deleteProducts()" :disabled="selectedProducts.length < 1 ? true : false">Delete</v-btn>
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
                  <v-tabs-window-item
                  :value="3"
                >
                  <v-container>
                    <v-row class="justify-end">
                      <v-col cols="4 d-flex justify-end">
                        <v-btn color="error" @click="deleteSale()">Delete</v-btn>
                      </v-col>
                      </v-row>
                    <v-data-table 
                      v-model="selectedSales"
                      :headers="salesHeaders"
                      :items="sales"
                      :search="search"
                      item-value="name"
                      return-object
                      show-select>

                    </v-data-table>
                  </v-container>
              </v-tabs-window-item>
              </v-tabs-window>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-dialog v-model="saleDialog" width="400">
        <v-card class="px-4 py-4">
          <div class="text-h5 mb-4">New Sale</div>
          <div class="text-body-1 mt-3 font-weight-bold mb-2">Product</div>
          <div class="text-h5 mb-4">{{ newSale.name }}</div>
          <div class="text-body-1 mt-3 font-weight-bold mb-2">Quantity</div>
          <div>
            <v-text-field v-model="newSale.quantity" type="number"/>          
          </div>
          <div class="d-flex justify-end">
            <v-btn color="primary" @click="addSale()">Add Sale</v-btn>
          </div>
        </v-card>
      </v-dialog>

    </v-main>

    <AppFooter />
  </v-app>
</template>

<script>
  import axios from 'axios';
  import readXlsxFile from 'read-excel-file'
  export default {
    data(){
      return{
        name: 'CDMD Pharmacy',
        apiURL: 'http://localhost:3001',
        tab: 1,
        selectedProducts: [],
        selectedSales: [],
        products: [],
        sales: [],
        search: '',
        month: '',
        selectedDate: new Date(),
        summary: {},
        
        isEdit: false,
        saleDialog: false,

        showAlert: false,
        alertText: '',
        alertType: '',
        
        newProduct: {},
        newSale: {},
        months: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ],
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
          "MEDICAL SUPPLY",
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
        ],

        salesHeaders: [
          { title: 'Product', key: 'name' },
          { title: 'Quantity', key: 'quantity' },
          { title: 'Cost Price', key: 'cost_price' },
          { title: 'Retail Price', key: 'retail_price' },
          { title: 'Gross Sale', key: 'gross_sale' },
          { title: 'Net Sale', key: 'net_sale' },
          { title: 'Sales Date', key: 'sales_date' },
        ],
      }
    },

    mounted(){
      this.getAllProducts();
      this.getSales();
      this.getMonth();
    },

    watch: {
      selectedDate(){
        this.calculateMonthlyGrossAndNet();
        this.calculateDailyGrossAndNet();
      }
    },

    methods: {

      /** 
      populateDatabase(){
        const input = document.getElementById('input')
          readXlsxFile(input.files[0]).then((rows) => {
            rows.forEach((row) => {
              this.newProduct.name = row[0];
              this.newProduct.category = row[1];
              this.newProduct.costPrice = row[2];
              this.newProduct.retailPrice = row[3];
              this.newProduct.stock = row[4];
              this.addProduct();
            })
          })
      },
      */

      getAllProducts(){
        //get all products from the database using axios
        axios.get(this.apiURL + '/products')
        .then(res => {
           this.products = res.data;
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
      },

      deleteSale(){
        let deleteIDArray = [];
        console.log(this.selectedSales)
        for(let i = 0; i < this.selectedSales.length; i++){
          deleteIDArray.push(this.selectedSales[i].sale_id);
        }
        axios.post(this.apiURL + '/deleteSales', deleteIDArray)
        .then(res => {
           this.alertText = res.data.message;
           this.alertType = res.data.type;
           this.showAlert = true;
           setTimeout(() => {
             this.showAlert = false;
           }, 2000);
           this.selectedSales = [];
           this.getSales();
        });
      },

      openSaleDialog(){
        this.newSale.name = this.selectedProducts[0].name;
        this.saleDialog = true;
      },


      getSales(){
        axios.get(this.apiURL + '/sales')
        .then(res => {
           this.sales = res.data;
           this.calculateMonthlyGrossAndNet();
           this.calculateDailyGrossAndNet();
         });
      },

      addSale(){
        this.newSale.productId = this.selectedProducts[0].product_id;
        this.newSale.salesDate = new Date();
        this.newSale.costPrice = this.selectedProducts[0].cost_price;
        this.newSale.retailPrice = this.selectedProducts[0].retail_price;
        this.newSale.grossSale = this.newSale.quantity * this.newSale.retailPrice;
        this.newSale.netSale =  this.newSale.grossSale - (this.newSale.quantity * this.newSale.costPrice)
        
        axios.post(this.apiURL + '/sales', this.newSale)
        .then(res => {
           this.alertText = res.data.message;
           this.alertType = res.data.type;
           this.showAlert = true;
           setTimeout(() => {
             this.showAlert = false;
           }, 2000);
           //update the stock of the product
           let stock = parseInt(this.selectedProducts[0].stock) - parseInt(this.newSale.quantity)
           let updatedProduct = this.selectedProducts[0]
           updatedProduct.stock = stock;
           updatedProduct.costPrice = this.selectedProducts[0].cost_price;
           updatedProduct.retailPrice = this.selectedProducts[0].retail_price;
           
           axios.put(this.apiURL + '/products/' + updatedProduct.product_id, updatedProduct)
           .then(res => {
            this.newSale = {};
            this.getSales();
            this.saleDialog = false;
           });
        });
      },

      getMonth(){
        this.month = this.months[new Date().getMonth()];
      },

      calculateMonthlyGrossAndNet(){
        let month = this.selectedDate.getMonth();
        let gross = 0;
        let net = 0;
        for(let i = 0; i < this.sales.length; i++){
           let saleDate = new Date(this.sales[i].sales_date)
           if(this.months[saleDate.getMonth()] == this.months[month]
            && saleDate.getFullYear() == this.selectedDate.getFullYear()){
             gross += this.sales[i].gross_sale;
             net += this.sales[i].net_sale;
           }

        }
        
        this.summary.monthGross = gross;
        this.summary.monthNet = net;
      },

      calculateDailyGrossAndNet(){
        let day = this.selectedDate.getDate();
        let gross = 0;
        let net = 0;
        for(let i = 0; i < this.sales.length; i++){
           let saleDate = new Date(this.sales[i].sales_date)
           if(saleDate.getDate() == day
            && saleDate.getMonth() == this.selectedDate.getMonth()
            && saleDate.getFullYear() == this.selectedDate.getFullYear()){
             gross += this.sales[i].gross_sale;
             net += this.sales[i].net_sale;
           }
        }

        this.summary.dailyGross = gross;
        this.summary.dailyNet = net;
      }
  }
}
</script>
