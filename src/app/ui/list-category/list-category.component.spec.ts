import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ListTaskComponent } from '../list-task/list-task.component';
import { TaskService } from 'src/app/infraestructure/services/task/task.service';
import { CategoryService } from 'src/app/infraestructure/services/category/category.service';
import { ModalController, LoadingController } from '@ionic/angular/standalone';
import { RemoteConfigService } from 'src/app/infraestructure/services/remote-config.service';
// Mock services
const mockTaskService = {
  addTask: jasmine.createSpy('addTask').and.returnValue(Promise.resolve()),
  getTasks: jasmine.createSpy('getTasks').and.returnValue(Promise.resolve([])),
  updateTask: jasmine.createSpy('updateTask').and.returnValue(Promise.resolve()),
  deleteTask: jasmine.createSpy('deleteTask').and.returnValue(Promise.resolve()),
   hasPrevious: () => false,
   hasNext: () => false,
};

const mockRemoteConfigService = {
  getValue: (key: string) => {
    if (key === 'hideCategoryModule') {
      return 'true';  // or whatever mock value you want
    }
    return null;
  }
};



const mockCategoryService = {
  getCategories: jasmine.createSpy('getCategories').and.returnValue(Promise.resolve([]))
};



const modalControllerMock = {
  create: jasmine.createSpy('create').and.returnValue(Promise.resolve({
    present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
    onDidDismiss: jasmine.createSpy('onDidDismiss').and.returnValue(Promise.resolve({ data: null }))
  }))
};

const loadingControllerMock = {
  create: jasmine.createSpy('create').and.returnValue(Promise.resolve({
    present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
    dismiss: jasmine.createSpy('dismiss').and.returnValue(Promise.resolve())
  }))
};

describe('ListTaskComponent', () => {
  let component: ListTaskComponent;
  let fixture: ComponentFixture<ListTaskComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ListTaskComponent], 
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: ModalController, useValue: modalControllerMock },
        { provide: LoadingController, useValue: loadingControllerMock },
        { provide: RemoteConfigService, useValue: mockRemoteConfigService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('Crear categoria', () => {
    expect(component).toBeTruthy();
  });

  it('Actualizar categoria', async () => {
    // Setup a task in tasksList
    component.tasksList = [{ id: '123', isExec: false, description: '', active: true, category: undefined } as any];

    await component.updateTaskExec('123', true);

    expect(component.tasksList[0].isExec).toBeTrue();
    expect(mockTaskService.updateTask).toHaveBeenCalledWith(component.tasksList[0]);
  });

  it('Borrar tarea', async () => {
  component.tasksList = [
    { id: '1', description: 'Task 1', isExec: false } as any,
    { id: '2', description: 'Task 2', isExec: false } as any
  ];

  mockTaskService.deleteTask.and.returnValue(Promise.resolve());

  await component.deleteTask('1');

  expect(mockTaskService.deleteTask).toHaveBeenCalledWith('1');
  expect(component.tasksList.length).toBe(1);
  expect(component.tasksList.find(t => t.id === '1')).toBeUndefined();
});
});
