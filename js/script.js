//storageController
const storageController = (()=>{
        let storageObject =
        {
            storageInit: function()
            {
                if(!localStorage.hasOwnProperty('ideas'))
                {
                    localStorage.setItem('ideas', JSON.stringify([]));
                }
            },
            getNewID: function()
            {
                let data = JSON.parse(localStorage.getItem('ideas'));
                if (data.length === 0)
                {
                    return 1;
                }
                else if (data.length >= 1)
                {
                    return data[data.length-1].id+1;
                }
            },
            pushItem: function(item)
            {
                    let currentData = JSON.parse(localStorage.getItem('ideas'));
                    currentData.push(item);
                    localStorage.setItem('ideas', JSON.stringify(currentData));
            },
            getItems: function()
            {
                return JSON.parse(localStorage.getItem('ideas'));
            },
            getDataById: function(id)
            {
                let allItems = storageObject.getItems();
                let askedItem = allItems.filter(item=> item.id==id);
                return askedItem[0];
            },
            deleteItem: function(id)
            {
                let allItems = storageObject.getItems();
                let index = allItems.findIndex(item=> item.id== id);
                allItems.splice(index, 1);
                localStorage.setItem('ideas', JSON.stringify(allItems));
                
            }
        }
        return storageObject;
})();

//UIController
const UIController = (()=>{
    //List of selectors
    const UISelectors = 
    {
        contentBox: '.content',
        formCaller: '#formCaller',
        formModal: '#formHolder',
        formModalCloser: '.modal-background',
        submitButton: '#submitButton',
        form: {
            title: '#title',
            subtitle: '#subtitle',
            description: '#description',
            tags: '#tags',
            required: [this.title, this.subtitle]
        },
        input: '.input',
        textArea: '.textarea'
    }

    const submitButtonChecker = function()
    {
        let formData = dataController.getFormData();
            let submitButton =  document.querySelector(UISelectors.submitButton);
            if(formData.title !== '' && formData.subtitle !== '')
            {
                if(submitButton.disabled)
                {
                    submitButton.disabled = false;
                }
            }
            else if(formData.title == '' || formData.subtitle == '')
            {
                if(!submitButton.disabled)
                {
                    submitButton.disabled = true;
                }
            }
    }

    //event functions are added here
    const UIEvents = 
    {
        activateForm: function()
        {
            document.querySelector(UISelectors.formModal).classList.add('is-active');
            document.querySelector(UISelectors.submitButton).disabled = true;
        },
        disableForm: function()
        {
            document.querySelector(UISelectors.formModal).classList.remove('is-active');
        },
        loadContentModal: function(id)
        {
                    let singleItem = storageController.getDataById(id);
                    document.querySelector('#itemTitle').textContent = singleItem.title;
                    document.querySelector('#itemTags').textContent = singleItem.tags;
                    document.querySelector('#itemDescription').textContent = singleItem.description;
                    document.querySelector('.contentModal').classList.add('is-active'); 

                    document.querySelector('.modal-background').addEventListener('click', (e)=>{
                    e.target.parentElement.classList.remove('is-active');
                })
        },
        deleteContent: function(id)
        {
            console.log(`gonna delete ${id}`);
            storageController.deleteItem(id);
            UIController.displayItems();
        },
        submitForm: function(e)
        {
            e.preventDefault();
            let formData = dataController.getFormData();
            let newItem = formData;
            let idForThisItem = storageController.getNewID();
            newItem.id = idForThisItem;
            storageController.pushItem(newItem);
            document.querySelector('form').reset();
            UIEvents.disableForm();
            UIObject.displayItems();
        },
        onFocus: function(e)
        {
           let Classes = e.target.classList;
           if(Classes.contains('is-danger'))
           {
            Classes.remove('is-danger');
           }
        },
        onBlur: function(e)
        { 
            let required = UISelectors.form.required;
               required.forEach((field)=>{
                   if (field.value!== '')
                   {
                   field.classList.add('is-primary');
                   }
               });
        },
        onKeyUp: function()
        {
            let required = UISelectors.form.required;
                required.forEach((field)=>{
                    if (field.value!== '')
                    {
                    field.classList.remove('is-danger');
                    field.classList.add('is-primary');
                    }
                    else if (field.value== '')
                    {
                        field.classList.remove('is-primary');
                        field.classList.add('is-danger');
                    }
                })
                document.querySelector(UISelectors.submitButton).disabled = false;
            submitButtonChecker();
        }
    }


const UIObject = 
{
        displayItems: function()
        {
            let items = storageController.getItems();
                let htmlData = ``;
                items.forEach(element => {
    htmlData += `<div class="column is-4 has-text-centered">
                    <div class="box itemBox" data-id="${element.id}">
                        <h3 class="title">${element.title}</h3>
                        <p class="description">${element.subtitle}</p>
                        </br>
                        <div class="is-grouped has-text-centered">
                            <!-- p class=""-->
                                <button class="button contentLoader" >
                                    View
                                </button>
                            <!--/p--->
                            <!--p class=""--->
                                <button class="button contentDeleter">
                                     Delete
                                </button>
                            <!--/p --->
                        </div>    
                    </div>
                 </div>`
                });
                htmlData+= `<div class="column is-4 has-text-centered">
                <div class="box" id="formCaller">
                    <br>
                    <br>
                    <br>
                    <i class="fas fa-2x fa-plus-circle"></i>
                </div>`;
               document.querySelector(UISelectors.contentBox).innerHTML = htmlData;
                UIObject.eventListenerAdders();
                
              
        },
        eventListenerAdders: function()
        {
            document.querySelector(UISelectors.formCaller).addEventListener('click', UIEvents.activateForm);
            document.querySelector(UISelectors.formModalCloser).addEventListener('click', UIEvents.disableForm);
            document.querySelector(UISelectors.submitButton).addEventListener('click', UIEvents.submitForm);
            document.querySelectorAll('.contentLoader').forEach((element)=>{
                element.addEventListener('click', (e)=>{
                            let id = e.target.parentElement.parentElement.getAttribute('data-id');
                            UIEvents.loadContentModal(id);
                });
            });
            
            document.querySelectorAll('.contentDeleter').forEach((element)=>{
                element.addEventListener('click', (e)=>{
                            let id = e.target.parentElement.parentElement.getAttribute('data-id');
                            UIEvents.deleteContent(id, e.target.parentElement.parentElement);
                });
            });

            document.querySelector('#formHolder>.modal-background').addEventListener('click', (e)=>{
                e.target.parentElement.classList.remove('is-active');
            })
            let required = UISelectors.form.required;
            required.forEach((field)=>{
                field.addEventListener('focus', UIEvents.onFocus);
                field.addEventListener('blur', UIEvents.onBlur);
                field.addEventListener('keyup', UIEvents.onKeyUp);
            });
        },
        getUISelectors: function()
        {
            return UISelectors;
        }
    }

    return UIObject;
})();

//dataController
const dataController = (()=>{
    const itemData = (id, title, shortDescription, detail, tags) =>{
            this.id = id;
            this.title = title;
            this.shortDescription = shortDescription;
            this.detail = detail;
            this.tags = tags;
    };

        
    const data = {
        items: [
            // {
            //     id: 1,
            //     title: 'title 1',
            //     shortDescription: 'some short description without contexct 1',
            //     detail: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. 1111111111 reprehenderit officiis perferendis modi aspernatur, delectus adipisci dicta suscipit nobis!',
            //     tags: 'tag1,tag2,tag3'
            // },
            // {
            //     id: 2,
            //     title: 'title 2',
            //     shortDescription: 'some short description without contexct 2',
            //     detail: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. 222222 reprehenderit officiis perferendis modi aspernatur, delectus adipisci dicta suscipit nobis!',
            //     tags: 'tag17,tag27,tag33'
            // },
            // {
            //     id: 3,
            //     title: 'title 3',
            //     shortDescription: 'some short description without contexct 3',
            //     detail: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. 33333333 reprehenderit officiis perferendis modi aspernatur, delectus adipisci dicta suscipit nobis!',
            //     tags: 'tag14,tag2,tag6'
            // },
            // {
            //     id: 4,
            //     title: 'title 4',
            //     shortDescription: 'some short description without contexct 4',
            //     detail: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. 44444444 reprehenderit officiis perferendis modi aspernatur, delectus adipisci dicta suscipit nobis!',
            //     tags: 'tag1,tag2,tag11'
            // }
        ],
        currentItem: null
    }

    const dataObject =
    {
        getData: function(){return data;},
        getItems: function()
        {
            let currentItems = storageController.get();
            data.items = currentItems;
            UIController.displayItems(data.items);
        },
        getFormData: function(){
            let form = UIController.getUISelectors();
            let formValues = {
                title: document.querySelector(form.form.title).value,
                subtitle: document. querySelector(form.form.subtitle).value,
                description: document.querySelector(form.form.description).value,
                tags: document.querySelector(form.form.tags).value
            }
            return formValues;
        }
    }
    return dataObject;
})();

//mainController
const mainController = ((sctrl, uictrl)=>
{
    return {
        init: function() 
        {
            sctrl.storageInit();
            uictrl.displayItems();
        }
    }

})(storageController, UIController, dataController);

mainController.init();