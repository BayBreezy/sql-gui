<template>
  <div>
    <VNavigationDrawer v-model="mainDrawer">
      <p class="font-weight-medium text-h6 ma-3">SQL GUI</p>
      <VList v-model:selected="selectedDB" v-if="!pending">
        <VListSubheader>Databases</VListSubheader>

        <VListItem :value="db" link v-for="db in databases" :key="db">
          <template #prepend>
            <VIcon @click="loadTables(db)" class="mr-4" size="20">fluent:database-24-regular</VIcon>
          </template>
          <template #append>
            <VBtn @click="deleteDb(db)" flat size="x-small" icon
              ><VIcon>fluent:delete-24-regular</VIcon></VBtn
            >
          </template>
          <VListItemTitle @click="loadTables(db)" class="text-body-2">{{ db }}</VListItemTitle>
        </VListItem>
      </VList>
      <div v-else class="text-center mt-10">
        <VProgressCircular size="100" width="2" indeterminate color="primary" />
        <p class="font-weight-light text-body-2 mt-5">Loading databases...</p>
      </div>
      <template #append>
        <div class="pa-1 px-2">
          <VBtn flat class="text-none text-body-2" border block>
            <CreateDbModal @create="refresh()" />
            <VIcon size="16" class="mr-md-2" icon="fluent:add-24-regular" />
            <span class="hidden-sm-and-down">Create Database</span>
          </VBtn>
        </div>
      </template>
    </VNavigationDrawer>
    <VAppBar class="shadow">
      <VAppBarNavIcon @click="mainDrawer = !mainDrawer" />
      <VToolbarTitle class="hidden-sm-and-down">Databases</VToolbarTitle>
      <VSpacer />
      <VBtn :icon="$vuetify.display.smAndDown" @click="disconnect" class="text-none text-body-2">
        <VIcon size="16" class="mr-md-2" icon="fluent:plug-disconnected-24-regular" />
        <span class="hidden-sm-and-down">Disconnect</span>
      </VBtn>
      <VBtn variant="plain" @click="toggleTheme()" icon>
        <VScaleTransition group mode="out-in" leave-absolute hide-on-leave>
          <VIcon v-if="theme.current.value.dark" size="18">fluent:weather-sunny-24-filled</VIcon>
          <VIcon v-else size="18">fluent:weather-moon-24-filled</VIcon>
        </VScaleTransition>
      </VBtn>
      <VTooltip location="bottom" text="Toggle Table Menu">
        <template #activator="{ props }">
          <VBtn v-bind="props" variant="plain" @click="showTableDrawer = !showTableDrawer" icon>
            <VIcon size="18">fluent:expand-up-left-24-regular</VIcon>
          </VBtn>
        </template>
      </VTooltip>
    </VAppBar>
    <VNavigationDrawer location="right" :model-value="showTableDrawer" class="overflow-x-hidden">
      <NuxtScrollbar tag="div" class="h-100 w-100 overflow-y-auto overflow-x-hidden">
        <VList width="300" v-if="loadedTables && loadedTables.length > 0">
          <VListSubheader>Tables</VListSubheader>
          <template v-for="table in loadedTables" :key="table">
            <v-tooltip location="right">
              <template v-slot:activator="{ props }">
                <VListItem @click="loadTableDetails(table.table_name)" v-bind="props" link>
                  <template #prepend>
                    <VIcon class="mr-4" size="20">fluent:table-24-regular</VIcon>
                  </template>
                  <VListItemTitle class="text-body-2">{{ table.table_name }}</VListItemTitle>
                </VListItem>
              </template>
              <span class="text-body-2">{{ table.table_name }}</span>
            </v-tooltip>
          </template>
        </VList>
      </NuxtScrollbar>
    </VNavigationDrawer>
    <VContainer>
      <VTable
        height="86vh"
        fixed-header
        class="border rounded"
        v-if="tableDetails && tableDetails.length > 0"
      >
        <thead>
          <tr class="text-body-2">
            <th class="font-weight-bold">Name</th>
            <th class="font-weight-bold">Default Value</th>
            <th class="font-weight-bold">Type</th>
            <th class="font-weight-bold">Nullable?</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="column in tableDetails" :key="column.name">
            <td>{{ column.name }}</td>
            <td>{{ column.defaultValue }}</td>
            <td>{{ column.type }}</td>
            <td>{{ column.null }}</td>
          </tr>
        </tbody>
      </VTable>
    </VContainer>
  </div>
</template>

<script setup lang="ts">
  import { useTheme } from "vuetify";

  // vuetify theme
  const theme = useTheme();
  const loadedTables = ref<any[]>([]);
  const tableDetails = ref<TTableDetails[]>();
  const showTableDrawer = ref(false);
  const selectedDB = ref<string[]>([]);
  const mainDrawer = ref();

  // Method used to change from light to dark theme
  const toggleTheme = () => {
    theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
  };
  const {
    data: databases,
    pending,
    refresh,
  } = await useAsyncData("databases", () => useQueries().getDbs(), {
    default: () => [],
    server: false,
  });

  // Method used to load tables
  const loadTables = async (db: string) => {
    loadedTables.value = await useToast().promise(
      useQueries().getTables(db),
      {
        pending: "Loading tables...",
        success: "Tables loaded",
        error: {
          render(err: any) {
            return err.message;
          },
        },
      },
      { closeButton: true }
    );
    showTableDrawer.value = true;
    tableDetails.value = [];
  };
  // Method used to load table details
  const loadTableDetails = async (tableName: string) => {
    const db = selectedDB.value[0];
    tableDetails.value = await useToast().promise(
      useQueries().getTableDetails(db, tableName),
      {
        pending: "Loading table details...",
        success: "Table details loaded",
        error: {
          render(err: any) {
            return err.message;
          },
        },
      },
      {
        closeButton: true,
      }
    );
  };
  // Method used to delete a db
  const deleteDb = async (db: string) => {
    await useToast().promise(
      useQueries().deleteDB(db),
      {
        pending: "Deleting database...",
        success: {
          render() {
            refresh();
            return "Database deleted";
          },
        },
        error: {
          render(err: any) {
            return err.message;
          },
        },
      },
      {
        closeButton: true,
        closeOnClick: true,
      }
    );
  };

  // Method used to disconnect from database
  const disconnect = async () => {
    useToast().promise(
      new Promise((res) => {
        useClearConnections();
        useRouter().push("/");
        res("Disconnected");
      }),
      {
        pending: "Disconnecting...",
        success: "Disconnected",
        error: {
          render(err: any) {
            return err.message;
          },
        },
      },
      { closeButton: true, closeOnClick: true }
    );
  };

  onMounted(async () => {
    // check if connection data is set
    const connectionData = useGetConnections();
    if (!connectionData) {
      await useRouter().push("/");
      useToast().info("Please set connection data first");
    }
  });
</script>
