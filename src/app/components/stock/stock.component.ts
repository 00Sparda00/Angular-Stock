import { Component, OnInit, inject, ViewChild } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Subject } from 'rxjs'
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardSubtitle,
  MatCardContent,
} from '@angular/material/card'

// Import Dialog
import { MatDialog } from '@angular/material/dialog'

import { MatIconButton, MatButton } from '@angular/material/button'
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
  MatTableDataSource
} from '@angular/material/table'
import { DecimalPipe, SlicePipe } from '@angular/common'
import { MatIcon } from '@angular/material/icon'
import { MatInput } from '@angular/material/input'
import { MatFormField, MatSuffix } from '@angular/material/form-field'
import { FormsModule } from '@angular/forms'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort, MatSortHeader } from '@angular/material/sort'

// Import ProductService
import { ProductService } from '../../services/product.service'

// Import Environment
import { environment } from '../../../environments/environment'
import { CreateProductDialogComponent } from '../create-product-dialog/create-product-dialog.component'
import { EditProductDialogComponent } from '../edit-product-dialog/edit-product-dialog.component'

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss',
  standalone: true,
  imports: [
    RouterLink,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatIcon,
    MatFormField,
    MatSuffix,
    MatPaginator,
    MatSort,
    MatSortHeader,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatInput,
    FormsModule,
    DecimalPipe,
    SlicePipe,
    MatButton,
    MatIconButton
  ]
})
export class StockComponent implements OnInit {

  private http = inject(ProductService)
  private dialog = inject(MatDialog)

  // Image URL
  imageUrl = environment.dotnet_api_url_image
  dataSource = new MatTableDataSource<Record<string,string>>()
  searchValue = ''
  searchTerm = new Subject<string>()

  page = 1
  limit = 100
  selectedCategory = ''
  searchQuery = ''

  // Columns for Table
  displayedColumns = [
    'productID',
    'productPicture',
    'productName',
    'unitPrice',
    'unitInStock',
    'categoryName',
    'action',
  ]

  // Pagination
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator
  @ViewChild(MatSort, { static: false }) sort!: MatSort

  // Method getProducts
  getProducts() {
    this.http
    .getAllProducts(
      this.page,
      this.limit,
      this.selectedCategory,
      this.searchQuery
    )
    .subscribe({
      next: (result) => {
        console.log(result)
        this.dataSource.data = result.products
      },
      error: (error) => {
        console.error(error)
      },
    })
  }

  // Method ngOnInit
  ngOnInit(): void {
    // ดึงข้อมูลสินค้า
    this.getProducts()
  }

  // Method ngAfterViewInit
  ngAfterViewInit() {
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
  }

  // Method onClickAddProduct
  async onClickAddProduct() {
    // เรียกเปิด dialog สำหรับเพิ่มสินค้า
    const dialogAddRef = await this.dialog.open(CreateProductDialogComponent, {
      width: '600px',
    })

    dialogAddRef.componentInstance.productCreated.subscribe((created) => {
      if (created) {
        // ดึงข้อมูลสินค้า
        this.getProducts()
      }
    })
  }

  // Method onClickEdit
  async onClickEdit(product: any) {
    const dialogEditRef = await this.dialog.open(EditProductDialogComponent, {
      width: '600px',
      data: product,
    })

    dialogEditRef.componentInstance.productUpdated.subscribe((updated) => {
      if(updated) {
        this.getProducts()
      }
    })
  }

  // Method Delete Product
  onClickDelete(row: any) {
    // do something
  }

  // Method filter product
  async doFilter(event: any) {
    // // do something
    this.dataSource.filter = event.target.value.trim()
  }

  // Method clear search
  clearSearch() {
    this.searchValue = ''
    this.searchTerm.next('')
    this.dataSource.filter = ''
  }

  // Method Export to PDF
  onClickExportPDF() {
    // do something
  }

  // Method Export to Excel
  onClickExportCSV() {
    // do something
  }

}