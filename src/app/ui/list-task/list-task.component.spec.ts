import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { ListTaskComponent } from './list-task.component';
import { RemoteConfig } from '@angular/fire/remote-config';
import { TaskService } from 'src/app/infraestructure/services/task/task.service';
import { CategoryService } from 'src/app/infraestructure/services/category/category.service';

describe('ListTaskComponent', () => {
  let component: ListTaskComponent;
  let fixture: ComponentFixture<ListTaskComponent>;

  const remoteConfigMock = {};
  const taskServiceMock = {
    updateTask: jasmine.createSpy('updateTask').and.returnValue(Promise.resolve()),
    addTask: jasmine.createSpy('addTask').and.returnValue(Promise.resolve()),
    deleteTask: jasmine.createSpy('deleteTask').and.returnValue(Promise.resolve()),
    getTasks: jasmine.createSpy('getTasks').and.returnValue(Promise.resolve([])),
  };
  const categoryServiceMock = {
    getCategories: jasmine.createSpy('getCategories').and.returnValue(Promise.resolve([])),
  };

  const modalControllerMock = {
    create: jasmine.createSpy('create').and.returnValue(Promise.resolve({
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
      onDidDismiss: jasmine.createSpy('onDidDismiss').and.returnValue(Promise.resolve({ data: null }))
    }))
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), ListTaskComponent],
      providers: [
        { provide: RemoteConfig, useValue: remoteConfigMock },
        { provide: TaskService, useValue: taskServiceMock },
        { provide: CategoryService, useValue: categoryServiceMock },
        { provide: ModalController, useValue: modalControllerMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should update task isExec and call updateTask', async () => {
    component.tasksList = [{ id: '1', isExec: false, description: '', active: true, category: undefined }];

    await component.updateTaskExec('1', true);

    expect(component.tasksList[0].isExec).toBeTrue();
    expect(taskServiceMock.updateTask).toHaveBeenCalled();
  });
});
