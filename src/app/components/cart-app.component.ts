import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartItem } from '../models/cartItem';
import { NavbarComponent } from "./navbar/navbar.component";
import { Router, RouterOutlet } from '@angular/router';
import { SharingDataService } from '../services/sharing-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart-app',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './cart-app.component.html'
})
export class CartAppComponent implements OnInit{


  items: CartItem[] = [];

  total: number = 0;

  constructor(private router: Router,private sharingDataService: SharingDataService, private service: ProductService) {}

  ngOnInit(): void {
    this.items = JSON.parse(sessionStorage.getItem("cart") || '[]');
    this.calculateTotal();
    this.onDeleteCart();
    this.onAddCart();
  }

  onAddCart(): void {
    this.sharingDataService.productEventEmitter.subscribe(product => {
      const hasItem = this.items.find(a => {return a.product.id === product.id})
      if(hasItem) {
        this.items = this.items.map(a => {
          if (a.product.id === product.id) {
            return {... a, quantity: a.quantity + 1}
          } else {
            return a;
          }
        })
      } else {
        this.items = [... this.items, {product: {...product}, quantity: 1}];
      }
      this.calculateTotal();
      this.saveSession();
      //this.router.navigate(['/cart'], {state: {items: this.items, total: this.total}})
      Swal.fire({
        title: 'Shopping Cart',
        text: 'Nuevo producto agregado',
        icon: 'success'
      })
    })
  }

  onDeleteCart(): void {
    this.sharingDataService.idProductEventEmitter.subscribe(id => {
      Swal.fire({
        title: 'Eliminar producto',
        text: 'Esta seguro de que desea eliminar',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar"
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(id + " se ha ejecutado el evento idProductEventEmitter")
          this.items = this.items.filter(a => {return a.product.id !== id});
          if( this.items.length === 0) {
            sessionStorage.removeItem('cart');
            sessionStorage.clear();
          }
          this.calculateTotal();
          this.saveSession();
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate(['/cart'], {state: {items: this.items, total: this.total}})
          })
          Swal.fire({
            title: "Producto eliminado!",
            text: "Se ha eliminado satisfactoriamente",
            icon: "success"
          })
        }
      })
  
      
    });
   
  }

  calculateTotal(): void {
    this.total = this.items.reduce((acc, item) => {
      return acc + (item.quantity * item.product.price);
    }, 0)
  }

  saveSession(): void {
    sessionStorage.setItem("cart", JSON.stringify(this.items))
  }
  

}
