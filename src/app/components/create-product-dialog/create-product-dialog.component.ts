import { Component, EventEmitter, inject } from '@angular/core'

// Form imports
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms'

// Form field ,select, button, icon and input imports
import { MatInput } from '@angular/material/input'
import { MatFormField, MatLabel } from '@angular/material/form-field'
import { MatButton } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon'
import { MatSelectModule } from '@angular/material/select'

// Card imports
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
} from '@angular/material/card'

// Material Dialog imports
import { MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'app-create-product-dialog',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    FormsModule,
    ReactiveFormsModule,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatIcon,
    MatSelectModule,
    MatDialogContent
  ],
  templateUrl: './create-product-dialog.component.html',
  styleUrl: './create-product-dialog.component.scss'
})
export class CreateProductDialogComponent {

  private formBuilder = inject(FormBuilder)
  public dialogRef = inject(MatDialogRef<CreateProductDialogComponent>)
  private dialog = inject(MatDialog)

  // Form
  formProduct!: FormGroup
  submitted: boolean = false
  imageURL = null
  imageFile = null

  // สร้างตัวแปรสำหรับเก็บข้อมูลประเภทสินค้า
  categories = [
    { value: '1', viewValue: 'Mobile' },
    { value: '2', viewValue: 'Tablet' },
    { value: '3', viewValue: 'Smart Watch' },
    { value: '4', viewValue: 'Labtop' },
  ]

  // ฟังก์ชันสำหรับเลือกรูปภาพ
  onChangeImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader()
      reader.onload = (e: any) => {
        this.imageURL = e.target.result
      }
      reader.readAsDataURL(event.target.files[0])
      this.imageFile = event.target.files[0]
    }
  }
  
  // ฟังก์ชันสำหรับล้างรูปภาพ
  removeImage() {
    this.imageURL = null
    this.imageFile = null
    // ล้างค่าใน input file
    const input = document.getElementById('image') as HTMLInputElement
    input.value = ''
  }

  // ฟังก์ชันสำหรับเริ่มต้น form
  initForm() {
    // format date "2024-04-26T00:00:00"
    const date = new Date()
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    const dateNow = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`

    this.formProduct = this.formBuilder.group({
      productname: ['', [Validators.required, Validators.minLength(3)]],
      unitprice: ['', [Validators.required]],
      unitinstock: ['', [Validators.required]],
      productpicture: [''],
      categoryid: ['', [Validators.required]],
      createddate: [dateNow],
      modifieddate: [dateNow]
    })
  }

  // Method ngOnInit() จะถูกเรียกเมื่อ component ถูกสร้างขึ้น
  ngOnInit() {
    this.initForm()
  }

  // Method onSubmit() จะถูกเรียกเมื่อมีการกดปุ่ม Submit
  onSubmit() {
    this.submitted = true
    if (this.formProduct.invalid) {
      return
    } else {

      // สร้าง object ชื่อ formData และกำหนดค่าเป็น new FormData()
      const formData: any = new FormData()

      // วนลูปดูค่าที่อยู่ใน formProduct
      for (let key in this.formProduct.value) {
        formData.append(key, this.formProduct.value[key])
      }

      // ถ้ามีการเลือกรูปภาพ
      if (this.imageFile) {
        formData.append('image', this.imageFile)
      }

      // วนลูปดูค่าที่อยู่ใน formData
      for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1])
      }

    }
  }


  // Method closeDialog() จะถูกเรียกเมื่อมีการกดปุ่ม Cancel
  closeDialog(): void {
    this.dialogRef.close(false)
  }

}
