import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoryList: string[] = [
    'ანდროლოგი',
    'ანესთეზიოლოგი',
    'კარდიოლოგი',
    'კოსმეტოლოგი',
    'ლაბორანტი',
    'ოჯახის ექიმი',
    'პედიატრი',
    'ტოქსიკოლოგი',
    'ტრანსფუზილოგი',
    'გინეკოლოგი',
    'დერმატოლოგი',
    'ენდოკრინოლოგი',
    'გასტროენტეროლოგი',
    'თერაპევტი'];

  constructor() { }

  getCategoryList(): string[] {
    return this.categoryList;
  }
}
