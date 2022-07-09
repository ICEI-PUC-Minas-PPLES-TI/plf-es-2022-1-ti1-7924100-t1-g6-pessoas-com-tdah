new Vue({
  el: '#app',
  
  vuetify: new Vuetify(),
  
  data: () => ({
      filters: {
        priority: '',
        status: '',
        deadline: ''
      },
      drawer: null,
      search: '',
      dialog: false,
      dialogDelete: false,
      tasks: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        priority: '',
        status: '',
        deadline: '',
        details: '',
      },
      defaultItem: {
        name: '',
        priority: '',
        status: '',
        deadline: '',
        details: '',
      },
      modal_date_picker: false,
      form_valid: true,
    }),

  computed: {
    headers () {
      return [
        { text: 'Tarefas', align: 'start', sortable: false, value: 'name', divider: true },
        {
          text: 'Prioridade',
          value: 'priority',
          align: 'center',
          filter: value => {
            if (!this.filters.priority || this.filters.priority === 'All') return true
            return value === this.filters.priority
          }
        },
        {
          text: 'Status',
          value: 'status',
          align: 'center',
          filter: value => {
            if (!this.filters.status || this.filters.status === 'All') return true
            return value === this.filters.status
          }
        },
        {
          text: 'Prazo final',
          value: 'deadline',
          align: 'center',
          filter: value => {
            if (!this.filters.deadline || this.filters.deadline === 'All') return true
            return this.classifyDate(value) === this.filters.deadline
          }
        },
        { text: 'Ação', align: 'center', value: 'actions', sortable: false },
      ]
    },
    formTitle () {
      if(this.editedIndex === -1){
        return 'Nova tarefa'
      }else if(this.editedIndex === 0){
        return 'Vizualizar tarefa'
      }else{
        return 'Editar tarefa'
      }
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },

  created () {
    this.initialize()
  },


  methods: {
    getPriorityColor (priority) {
      if (priority === 'Alta') return 'red'
      else if (priority === 'Média') return 'yellow'
      else return 'green'
    },

    getStatusColor (status) {
      if (status === 'A fazer') return 'blue'
      else if (status === 'Fazendo') return 'orange'
      else return 'success'
    },

    getFormattedDate (date) {
      return new Date(date).toJSON().slice(0,10).replace(/-/g,'/');
    },

    classifyDate(date){
      if (new Date().toJSON().slice(0,10) === date) return 'Para hoje'
      else if (new Date().toJSON().slice(0,10) > date) return 'Atrasada'
      else return 'Para o futuro'
    },

    getDateColor (date) {
      if (this.classifyDate(date) === 'Para hoje') return 'orange'
      else if (this.classifyDate(date) === 'Atrasada') return 'red'
      else return 'success'
    },

    initialize () {
      this.tasks = [
        {
          name: 'Entregar relatório',
          details: 'Lorem ipsum is a placeholder text used to fill unfilled spaces until proper text is found.',
          priority: 'Baixa',
          status: 'A fazer',
          deadline: '2022-05-05',
        },
        {
          name: 'Consulta',
          details: 'Lorem ipsum is a placeholder text used to fill unfilled spaces until proper text is found.',
          priority: 'Alta',
          status: 'Fazendo',
          deadline: '2021-05-22',
        },
        {
          name: 'Consulta',
          details: 'Lorem ipsum is a placeholder text used to fill unfilled spaces until proper text is found.',
          priority: 'Média',
          status: 'Feita',
          deadline: '2023-05-03',
        },
        {
          name: 'Entregar relatório',
          details: 'Lorem ipsum is a placeholder text used to fill unfilled spaces until proper text is found.',
          priority: 'Alta',
          status: 'Fazendo',
          deadline: '2021-05-25',
        },
        {
          name: 'Consulta',
          details: 'Lorem ipsum is a placeholder text used to fill unfilled spaces until proper text is found.',
          priority: 'Média',
          status: 'A fazer',
          deadline: '2024-05-13',
        },
        {
          name: 'Consulta',
          details: 'Lorem ipsum is a placeholder text used to fill unfilled spaces until proper text is found.',
          priority: 'Alta',
          status: 'A fazer',
          deadline: '2021-05-21',
        },
      ]
    },

    viewItem (item) {
      this.editedIndex = 0
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    editItem (item) {
      this.editedIndex = this.tasks.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.tasks.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      this.tasks.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close () {
      this.$refs.form.resetValidation()
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      if(this.validateForm()) {
        if (this.editedIndex > -1) {
          Object.assign(this.tasks[this.editedIndex], this.editedItem)
        } else {
          this.tasks.push(this.editedItem)
        }
        this.close()
      }
    },

    validateForm () {
      return this.$refs.form.validate();
    },
  }
})