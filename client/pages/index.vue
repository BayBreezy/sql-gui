<template>
  <VContainer class="fill-height">
    <VSlideXTransition leave-absolute hide-on-leave group>
      <SelectDb
        :options="options"
        v-if="!selectedDb"
        @select="selectedDb = $event"
        :selected-db="selectedDb"
      />
      <ConnectParams
        @call-connect="checkConnection"
        @clearselection="selectedDb = null"
        v-else
        :selected-db="selectedDb"
      />
    </VSlideXTransition>
    <VOverlay
      :close-on-content-click="false"
      no-click-animation
      persistent
      v-model="loading"
      absolute
      class="d-flex align-center justify-center"
    >
      <VProgressCircular size="100" width="2" indeterminate color="primary" />
      <p class="text-center mt-5">Loading...</p>
    </VOverlay>
  </VContainer>
</template>
<script lang="ts" setup>
  import { ConnectionString } from "connection-string";
  const options = [
    { title: "MySQL Database", icon: "logos:mysql", value: "mysql2" },
    { title: "Postgres Database", icon: "logos:postgresql", value: "postgres" },
  ];

  const loading = ref(false);

  const selectedDb = ref<typeof options[0] | null>();

  const checkConnection = async (connection: TConnect) => {
    try {
      loading.value = true;
      const client = useApiClient();
      // create a connection string
      const connectionString = new ConnectionString();
      connectionString.setDefaults({
        hosts: [{ name: connection.host, port: Number(connection.port) }],

        password: connection.password,
        user: connection.user,
        protocol: selectedDb.value?.value,
      });

      // send request to API to test connection

      await client("/sql/connection", {
        method: "POST",
        body: {
          client: selectedDb.value?.value,
          connectionString: connectionString.toString(),
        },
      });
      // if connection is successful, store the connection string & client in local storage
      useSetConnections({
        connectionString: connectionString.toString(),
        client: selectedDb.value?.value!,
      });

      // redirect to page with dbs
      useRouter().push("/dbs");
    } catch (error) {
      console.log(error);
      useClearConnections();
    } finally {
      loading.value = false;
    }
  };
</script>

<style scoped></style>
